from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from users.serializers import UserSerializer


class LoginSerializer(serializers.Serializer):
    """
    Serializer for login requests.
    """
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)

    def validate(self, attrs):
        """
        Validate login credentials and return user if valid.
        """
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid username or password.')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
            
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include username and password.')


class UserLoginResponseSerializer(serializers.ModelSerializer):
    """
    Serializer for user data returned after successful login.
    """
    profile = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']
        read_only_fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']
    
    def get_profile(self, obj):
        """
        Get user profile information including VIP status.
        """
        if hasattr(obj, 'profile'):
            return {
                'is_vip': obj.profile.is_vip,
                'vip_since': obj.profile.vip_since,
                'vip_until': obj.profile.vip_until,
                'is_vip_active': obj.profile.is_vip_active,
            }
        return None 