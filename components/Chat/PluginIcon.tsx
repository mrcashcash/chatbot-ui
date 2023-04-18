// PluginIconWrapper.tsx
import React from 'react';
import { IconBrandGoogle, IconBolt, IconFiles } from '@tabler/icons-react';
import { Plugin } from '@/types/plugin';


interface PluginIconWrapperProps {
    plugin: Plugin | null;
}

const PluginIconWrapper: React.FC<PluginIconWrapperProps> = ({ plugin }) => {
    if (plugin) {
        if (plugin.id === 'google-search') {
            return <IconBrandGoogle size={20} />;
        } else if (plugin.id === 'files-upload') {
            return <IconFiles size={20} />;
        }
    }
    return <IconBolt size={20} />;
};

export default PluginIconWrapper;
