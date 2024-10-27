declare module 'firebase-admin' {
    interface ServiceAccount {
        projectId?: string;
        clientEmail?: string;
        privateKey?: string;
    }

    export function auth() {
        throw new Error('Function not implemented.');
    }
}