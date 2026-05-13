import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { Link as LinkIcon, ExternalLink, Trash2, Search } from 'lucide-react';

export default function FilesView() {
  const { projects, removeResourceLinkFromProject } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  const projectsWithLinks = projects.filter(p => p.resourceLinks && p.resourceLinks.length > 0);

  const filteredProjects = projectsWithLinks.map(project => ({
    ...project,
    resourceLinks: project.resourceLinks?.filter(link =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [],
  })).filter(p => p.resourceLinks.length > 0);

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto animate-in fade-in duration-500 w-full flex flex-col pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Resource Links</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">View all project resource links organized by project</p>
        </div>
        <div className="hidden md:flex relative items-center w-full sm:w-auto">
          <Search className="w-4 h-4 absolute left-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search links..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium outline-none focus:ring-2 focus:ring-black w-full sm:w-64"
          />
        </div>
      </div>

      <div className="space-y-8 flex-1">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <div key={project.id} className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                <p className="text-sm text-gray-500 font-medium mt-1">by {project.client}</p>
              </div>

              <div className="divide-y divide-gray-100">
                {project.resourceLinks?.map(link => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-5 hover:bg-gray-50/50 transition-colors flex items-start justify-between gap-4 group"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <LinkIcon className="h-5 w-5 text-gray-400 shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-black">{link.title}</h4>
                        <p className="text-xs text-gray-500 font-medium mt-1 truncate group-hover:underline">{link.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-full border border-gray-200 text-gray-500 bg-white hover:border-gray-300 hover:text-black hover:bg-gray-50 flex items-center justify-center transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeResourceLinkFromProject(project.id, link.id);
                        }}
                        className="w-8 h-8 rounded-full border border-gray-200 text-gray-500 bg-white hover:border-red-200 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-sm font-medium text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
            {projectsWithLinks.length === 0
              ? 'No resource links added yet. Go to a project and add some links!'
              : 'No resource links match your search.'}
          </div>
        )}
      </div>
    </div>
  );
}
