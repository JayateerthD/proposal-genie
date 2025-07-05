from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

from django.core.exceptions import ValidationError

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'},
        help_text="Password must be at least 8 characters long"
    )
    password_confirm = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
        help_text="Confirm your password"
    )

    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name',
            'company', 'job_title', 'department',
            'password', 'password_confirm'
        ]
        extra_kwargs = {
            'email': {'help_text': 'Enter your work email address'},
            'first_name': {'help_text': 'Your first name'},
            'last_name': {'help_text': 'Your last name'},
            'company': {'help_text': 'Your company name (optional)', 'required': False},
            'job_title': {'help_text': 'Your job title (optional)', 'required': False},
            'department': {'help_text': 'Your department (optional)', 'required': False},
        }

    def validate_email(self, value):
        """Check if email already exists"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists.")
        return value.lower()

    def validate_password(self, value):
        """Validate password using Django's built-in validators"""
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value

    def validate(self, attrs):
        """Cross-field validation"""
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError({
                'password_confirm': "Password confirmation doesn't match password."
            })
        return attrs

    def create(self, validated_data):
        """Create user with validated data"""
        # Remove password_confirm from validated_data
        validated_data.pop('password_confirm', None)

        # Extract password
        password = validated_data.pop('password')

        # Create user instance
        user = User(**validated_data)
        user.set_password(password)  # Hash the password
        # Activate user immediately (you can change this for email verification)
        user.is_active = True
        user.save()

        return user


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'company', 'job_title', 'department', 'preferences',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'company',
            'job_title', 'department', 'preferences'
        ]
