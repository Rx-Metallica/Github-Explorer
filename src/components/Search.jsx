import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Star, GitForkIcon, ExternalLink, FileCode } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [repos, setRepos] = useState([]);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(false);

    // Fetch GitHub Repositories
    const fetchRepos = async () => {
        if (!searchQuery) return;
        setLoading(true);
        try {
            const response = await axios.get(
                `https://api.github.com/users/${searchQuery}/repos`
            );
            setRepos(response.data);
        } catch (error) {
            console.error("Error fetching repos:", error);
            alert("User not found or API limit exceeded.");
        } finally {
            setLoading(false);
        }
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetchRepos();
        setSearchQuery('');
    };

    // Sorting Function
    const handleSort = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);

        const sortedRepos = [...repos].sort((a, b) => {
            const aValue = field === "name" ? a.name.toLowerCase() : a[field];
            const bValue = field === "name" ? b.name.toLowerCase() : b[field];

            if (aValue < bValue) return order === 'asc' ? -1 : 1;
            if (aValue > bValue) return order === 'asc' ? 1 : -1;
            return 0;
        });

        setRepos(sortedRepos);
    };

    return (
        <div className='mt-20 mx-auto w-3/4 justify-center'>
            
            {/* Search Form */}
            <form onSubmit={handleSubmit} className='flex justify-center gap-4 mb-6'>
                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='border-2 hover:border-blue-700 rounded-sm p-2 w-100'
                    type="text"
                    placeholder="Enter GitHub Username"
                />
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Fetch'}
                </button>
            </form>

            {/* Display Table */}
            {repos.length > 0 ? (
                <div className="w-full max-w-7xl mx-auto overflow-hidden rounded-xl shadow-md border border-gray-300">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="semi-bold text-gray-500">
                                <th 
                                    className="p-4 text-left cursor-pointer hover:bg-gray-200"
                                    onClick={() => handleSort('name')}
                                >
                                    Repository {sortField === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th className="p-4 text-left hidden md:table-cell">Description</th>
                                <th 
                                    className="p-4 text-center cursor-pointer hover:bg-gray-200"
                                    onClick={() => handleSort('stargazers_count')}
                                >
                                    <Star/> {sortField === 'stargazers_count' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th 
                                    className="p-4 text-center cursor-pointer hover:bg-gray-200"
                                    onClick={() => handleSort('forks_count')}
                                >
                                    <GitForkIcon/> {sortField === 'forks_count' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {repos.map((repo, index) => (
                                <tr 
                                    key={repo.id} 
                                    className="border-t border-gray-700 hover:bg-gray-200 transition duration-200"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <td className="p-4 flex items-center gap-3">
                                        <Avatar className="h-10 w-10 rounded-full">
                                            <AvatarImage src={repo.owner.avatar_url} alt={repo.owner.login} />
                                            <AvatarFallback className="bg-gray-700 text-white">
                                                {repo.owner.login.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <a 
                                                href={repo.html_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:underline flex items-center gap-1"
                                            >
                                                {repo.name}
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                            <p className="text-xs text-gray-500">
                                                {repo.owner.login} • 
                                                <span className="ml-1">{repo.language || "Unknown"}</span>
                                                <FileCode className="h-3 w-3 inline ml-1" />
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Updated {formatDistanceToNow(new Date(repo.updated_at))} ago
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-4 hidden md:table-cell">
                                        {repo.description || 'No description available'}
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="h-4 w-4 text-amber-400" />
                                            <span>{repo.stargazers_count.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <GitForkIcon className="h-4 w-4 text-blue-400" />
                                            <span>{repo.forks_count.toLocaleString()}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500">Search for Repositories.</p>
            )}
            
            <div className='flex text-center justify-center mt-5 p-2'>
                Made with ❤️ by Aditya Mote
            </div>
        </div>
    );
};

export default Search;
