//// filepath: /workspaces/meta-ID_frontend/components/EditService.tsx
import React, { useState } from 'react';
import { Button } from "@heroui/react";
import EditDataModal from './EditDataModal';

interface EditServiceProps {
  shortUrl: string;
}

const EditService: React.FC<EditServiceProps> = ({ shortUrl }) => {
  const [showDataModal, setShowDataModal] = useState<boolean>(false);

  return (
    <div>
      <Button
        onPress={() => setShowDataModal(true)}
        size="md"
        className="mt-2 w-24 bg-white border border-blue-500 text-slate-800"
      >
        링크편집
      </Button>
      {showDataModal && (
        <EditDataModal 
          shortUrl={shortUrl} 
          onClose={() => setShowDataModal(false)} 
        />
      )}
    </div>
  );
};

export default EditService;