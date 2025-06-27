import axios from 'axios';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Star, GitForkIcon, ExternalLink, FileCode } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [repos, setRepos] = useState([]);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetchRepos();
        setSearchQuery('');
    };

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);

        const sortedRepos = [...repos].sort((a, b) => {
            const aValue = field === "name" ? a.name.toLowerCase() : a[field];
            const bValue = field === "name" ? b.name.toLowerCase() : b[field];
            return order === 'asc'
                ? aValue < bValue ? -1 : 1
                : aValue > bValue ? -1 : 1;
        });

        setRepos(sortedRepos);
    };

    return (
        <div className="mt-20 px-4 w-full max-w-7xl mx-auto">
            {/* Search Form */}
            <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
            >
                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-2 hover:border-blue-700 rounded-md px-4 py-2 w-full sm:w-96 focus:outline-none"
                    type="text"
                    placeholder="Enter GitHub Username"
                />
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded w-full sm:w-auto"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Fetch'}
                </button>
            </form>

            {/* Repo Table */}
            {repos.length > 0 ? (
                <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow">
                    <table className="w-full text-sm md:text-base table-auto">
                        <thead>
                            <tr className="text-gray-600 bg-gray-100">
                                <th
                                    onClick={() => handleSort('name')}
                                    className="p-3 text-left cursor-pointer whitespace-nowrap hover:bg-gray-200"
                                >
                                    Repository {sortField === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th className="p-3 text-left hidden md:table-cell">Description</th>
                                <th
                                    onClick={() => handleSort('stargazers_count')}
                                    className="p-3 text-center cursor-pointer hover:bg-gray-200"
                                >
                                    <Star className="inline-block mr-1" />
                                    {sortField === 'stargazers_count' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th
                                    onClick={() => handleSort('forks_count')}
                                    className="p-3 text-center cursor-pointer hover:bg-gray-200"
                                >
                                    <GitForkIcon className="inline-block mr-1" />
                                    {sortField === 'forks_count' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {repos.map((repo, index) => (
                                <tr
                                    key={repo.id}
                                    className="border-t hover:bg-gray-50 transition"
                                >
                                    <td className="p-4 flex items-center gap-3 min-w-[250px]">
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
                                                className="text-blue-600 hover:underline flex items-center gap-1"
                                            >
                                                {repo.name}
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                            <p className="text-xs text-gray-500">
                                                {repo.owner.login} • {repo.language || "Unknown"} <FileCode className="h-3 w-3 inline ml-1" />
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Updated {formatDistanceToNow(new Date(repo.updated_at))} ago
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-4 hidden md:table-cell">
                                        {repo.description || 'No description'}
                                    </td>
                                    <td className="p-4 text-center min-w-[80px]">
                                        <div className="flex justify-center items-center gap-1">
                                            <Star className="h-4 w-4 text-yellow-500" />
                                            {repo.stargazers_count.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center min-w-[80px]">
                                        <div className="flex justify-center items-center gap-1">
                                            <GitForkIcon className="h-4 w-4 text-blue-400" />
                                            {repo.forks_count.toLocaleString()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-6">Search for Repositories.</p>
            )}

            {/* Footer */}
            <div className="text-center text-sm text-gray-400 mt-6">
                    Made with ❤️ by{' '}
                <a
                    href="https://moteaditya.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 font-semibold hover:underline"
                >
                    Aditya Mote
                </a>
            </div>
        </div>
    );
};

export default Search;
