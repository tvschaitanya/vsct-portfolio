// src/components/ui/ModalContainer.jsx
import { useState, useEffect } from 'react';
import ProjectModal from './ProjectModal';

export default function ModalContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    // Listen for the custom event from project component
    const handleOpenModal = (event) => {
      setCurrentProject(event.detail);
      setIsOpen(true);
    };

    document.addEventListener('openProjectModal', handleOpenModal);

    return () => {
      document.removeEventListener('openProjectModal', handleOpenModal);
    };
  }, []);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <ProjectModal 
      isOpen={isOpen} 
      onClose={closeModal} 
      project={currentProject} 
    />
  );
}