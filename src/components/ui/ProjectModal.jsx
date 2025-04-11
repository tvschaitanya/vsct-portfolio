// src/components/ui/ProjectModal.jsx
import { useState, useEffect } from 'react';

const ProjectModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageContent, setPageContent] = useState(null);

  // Setup event listeners when component mounts
  useEffect(() => {
    // Handle project clicks
    const handleProjectClick = async (e) => {
      const link = e.currentTarget;
      if (link && link.getAttribute('href')?.startsWith('/projects/')) {
        e.preventDefault();
        
        // Get project data
        const projectElem = link.closest('.project-wrapper');
        const name = projectElem.querySelector('.project-name').textContent;
        const description = projectElem.querySelector('.project-description').textContent;
        const image = projectElem.querySelector('img').getAttribute('src');
        const url = link.getAttribute('href');
        
        // Set project data and open modal
        setProject({ name, description, image, url });
        setIsOpen(true);
        
        // Fetch the page content
        setIsLoading(true);
        try {
          const response = await fetch(url);
          if (response.ok) {
            const html = await response.text();
            // Extract just the main content from the page
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Try to extract only the main content
            // First look for specific project content
            const projectContent = doc.querySelector('.project-content') || 
                                  doc.querySelector('#project-content');
            
            if (projectContent) {
              setPageContent(projectContent.innerHTML);
            } else {
              // If no specific project content container found, try to extract main content
              // and exclude header/footer/navigation
              const main = doc.querySelector('main');
              
              if (main) {
                // Remove any navigation, header, or footer elements that might be within main
                const elementsToRemove = main.querySelectorAll('header, footer, nav');
                elementsToRemove.forEach(el => el.remove());
                setPageContent(main.innerHTML);
              } else {
                // Fallback to showing just basic project info
                setPageContent(null);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching page content:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    // Handle ESC key press
    const handleEsc = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    
    // Add click listeners to all project links
    document.querySelectorAll('a[href^="/projects/"]').forEach(link => {
      link.addEventListener('click', handleProjectClick);
    });
    
    // Add ESC key listener
    document.addEventListener('keydown', handleEsc);
    
    // Cleanup on unmount
    return () => {
      document.querySelectorAll('a[href^="/projects/"]').forEach(link => {
        link.removeEventListener('click', handleProjectClick);
      });
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);
  
  // Toggle body scroll when modal state changes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);
  
  // Close modal function
  const closeModal = () => setIsOpen(false);
  
  if (!isOpen || !project) return null;

  // Handle view full page click
  const handleViewFullPage = (e) => {
    // Close the modal first
    setIsOpen(false);
    // Don't prevent default - let the browser navigate to the URL
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="relative w-full max-w-5xl mx-4 bg-white dark:bg-neutral-900 max-h-[90vh] overflow-auto rounded-lg shadow-2xl">
        {/* Controls in absolute position with proper z-index */}
        <div className="absolute top-3 right-3 z-50 flex gap-2">
          <button 
            onClick={closeModal}
            className="px-4 py-2 text-sm font-medium bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
          >
            Close
          </button>
          
          <a 
            href={project.url} 
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            onClick={handleViewFullPage}
          >
            View Full Page
          </a>
        </div>
        
        {/* Project content with proper padding */}
        <div className="pt-16 px-6 pb-6"> {/* Padding to avoid overlap with buttons */}
          {isLoading ? (
            <div className="flex justify-center items-center h-[40vh]">
              <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <div className="project-modal-content">
              {/* Always show project info */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
                  {project.name}
                </h1>
                
                <img 
                  src={project.image.startsWith('/') ? project.image : `/${project.image}`} 
                  alt={project.name} 
                  className="w-full rounded-lg mb-6 aspect-[16/9] object-cover"
                />
                
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  {project.description}
                </p>
              </div>
              
              {/* Show page content if available */}
              {pageContent && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
                    Project Details
                  </h2>
                  
                  <div 
                    className="prose prose-lg dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: pageContent }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;