from rest_framework import serializers
from django.contrib.auth import authenticate
from users.models import CustomUser, UserActivityLog

class UserSerializer(serializers.ModelSerializer):
    """
    Сериализатор для пользователя
    """
    country_name = serializers.CharField(source='country.name', read_only=True)
    city_name = serializers.CharField(source='city.name', read_only=True)
    district_name = serializers.CharField(source='district.name', read_only=True)
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'role', 'company_name', 'phone', 'profile_photo', 
            'subscription_type', 'subscription_end_date', 'country',
            'country_name', 'city', 'city_name', 'district', 'district_name',
            'legal_address', 'website', 'fio', 'date_joined'
        ]
        read_only_fields = ['id', 'subscription_end_date', 'date_joined']

class RegisterSerializer(serializers.ModelSerializer):
    """
    Сериализатор для регистрации пользователя
    """
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'password2', 'role', 'country']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError("Пароли не совпадают")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    """
    Сериализатор для входа в систему
    """
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Неверные учетные данные')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Необходимо указать логин и пароль')
        
        return attrs

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Сериализатор для обновления профиля пользователя
    """
    class Meta:
        model = CustomUser
        fields = [
            'first_name', 'last_name', 'email', 'phone', 
            'company_name', 'country', 'city', 'district',
            'legal_address', 'website', 'fio', 'profile_photo'
        ]

class UserListSerializer(serializers.ModelSerializer):
    """
    Сериализатор для списка пользователей
    """
    country_name = serializers.CharField(source='country.name', read_only=True)
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'first_name', 'last_name', 
            'role', 'company_name', 'country_name', 'profile_photo'
        ]