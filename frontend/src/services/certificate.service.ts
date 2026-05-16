import api from './api';

export const certificateService = {
    async downloadCertificate(courseName: string) {
        const response = await api.get('/certificates/download', {
            params: { courseName },
            responseType: 'blob', // Important for downloading files
        });
        
        // Create a blob and trigger download
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${courseName.replace(/\s+/g, '_')}_Certificate.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    },

    async emailCertificate(courseName: string) {
        const response = await api.post('/certificates/email', { courseName });
        return response.data;
    },
};
