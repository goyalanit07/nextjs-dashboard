/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        ppr: 'incremental',
        serverActions: {
            bodySizeLimit: '6mb',
        },
    },
};

export default nextConfig;