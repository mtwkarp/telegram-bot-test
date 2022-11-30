
class GoogleCredentialsManager {
    static get serviceAccountCredentials() {
        const privateKey = process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replaceAll('\\n','\n');

        return {
            "type": process.env.SERVICE_ACCOUNT_TYPE,
            "project_id": process.env.SERVICE_ACCOUNT_PROJECT_ID,
            "private_key_id": process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
            "private_key": privateKey,
            "client_email": process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
            "client_id": process.env.SERVICE_ACCOUNT_CLIENT_ID,
            "auth_uri": process.env.SERVICE_ACCOUNT_AUTH_URI,
            "token_uri": process.env.SERVICE_ACCOUNT_TOKEN_URI,
            "auth_provider_x509_cert_url": process.env.SERVICE_ACCOUNT_AUTH_PROVIDER_CERT_URL,
            "client_x509_cert_url": process.env.SERVICE_ACCOUNT_CLIENT_CERT_URL
        }
    }
}

module.exports = GoogleCredentialsManager