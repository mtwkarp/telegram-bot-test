
export default class GoogleCredentialsManager {
    public static get serviceAccountCredentials() {
        const serviceAccountPrivateKey = process.env.SERVICE_ACCOUNT_PRIVATE_KEY as string
        const keyWithParagraphs = serviceAccountPrivateKey.replaceAll('\\n', '\n');

        return {
            'type': process.env.SERVICE_ACCOUNT_TYPE,
            'project_id': process.env.SERVICE_ACCOUNT_PROJECT_ID,
            'private_key_id': process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
            'private_key': keyWithParagraphs,
            'client_email': process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
            'client_id': process.env.SERVICE_ACCOUNT_CLIENT_ID,
            'auth_uri': process.env.SERVICE_ACCOUNT_AUTH_URI,
            'token_uri': process.env.SERVICE_ACCOUNT_TOKEN_URI,
            'auth_provider_x509_cert_url': process.env.SERVICE_ACCOUNT_AUTH_PROVIDER_CERT_URL,
            'client_x509_cert_url': process.env.SERVICE_ACCOUNT_CLIENT_CERT_URL
        };
    }
}
