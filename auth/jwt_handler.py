import jwt
from datetime import datetime, timedelta

class JWTHandler:
    """
    Class to handle JWT encoding and decoding with expiration.
    """

    @staticmethod
    def encode_token(user_id: str) -> str:
        """
        Encode a user ID into a JWT token with an expiration time.

        Args:
            user_id (str): The user ID to encode.

        Returns:
            str: The encoded JWT token.
        """
        payload = {
            'user_id': user_id,
            'exp': datetime.utcnow() + timedelta(hours=1),  # Token expires in 1 hour
        }
        token = jwt.encode(payload, 'SECRET_KEY', algorithm='HS256')
        return token

    @staticmethod
    def decode_token(token: str) -> dict:
        """
        Decode a JWT token and extract the user ID.

        Args:
            token (str): The JWT token to decode.

        Returns:
            dict: A dictionary containing the decoded payload, or an error if decoding fails.
        """
        try:
            payload = jwt.decode(token, 'SECRET_KEY', algorithms=['HS256'])
            return {'user_id': payload['user_id']}
        except jwt.ExpiredSignatureError:
            return {'error': 'Token has expired'}
        except jwt.InvalidTokenError:
            return {'error': 'Invalid token'}

# Example usage
if __name__ == "__main__":
    user_id = "12345"
    encoded_token = JWTHandler.encode_token(user_id)
    print(f"Encoded Token: {encoded_token}")

    decoded_payload = JWTHandler.decode_token(encoded_token)
    print(f"Decoded Payload: {decoded_payload}")