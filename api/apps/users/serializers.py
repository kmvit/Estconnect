from rest_framework import serializers
from django.contrib.auth import authenticate
from users.models import CustomUser, UserActivityLog
from developers.models import ConstructionObject, ConstructionObjectImage
from support.models import SupportTicket, SupportMessage


class ConstructionObjectImageSerializer(serializers.ModelSerializer):
    """
    Сериализатор для изображений объектов
    """
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ConstructionObjectImage
        fields = ['id', 'image', 'image_url', 'created_at']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class UserSerializer(serializers.ModelSerializer):
    """
    Сериализатор для пользователя
    """
    country_name = serializers.CharField(source='country.name', read_only=True)
    city_name = serializers.CharField(source='city.name', read_only=True)
    district_name = serializers.CharField(source='district.name', read_only=True)
    is_favourite = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'role', 'company_name', 'phone', 'profile_photo', 
            'subscription_type', 'subscription_end_date', 'country',
            'country_name', 'city', 'city_name', 'district', 'district_name',
            'legal_address', 'website', 'fio', 'date_joined', 'is_favourite'
        ]
        read_only_fields = ['id', 'subscription_end_date', 'date_joined']
    
    def get_is_favourite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            current_user = request.user
            # Проверяем, находится ли пользователь в избранном в зависимости от его роли
            if obj.role == 'agent':
                return current_user._favourite_agents.filter(id=obj.id).exists()
            elif obj.role == 'developer':
                return current_user._favourite_developers.filter(id=obj.id).exists()
        return False


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
            'legal_address', 'website', 'fio', 'profile_photo',
            'language', 'preferred_contact_method'
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



class ConstructionObjectSerializer(serializers.ModelSerializer):
    """
    Сериализатор для объектов недвижимости
    """
    images = ConstructionObjectImageSerializer(many=True, read_only=True)
    country_name = serializers.CharField(source='country.name', read_only=True)
    city_name = serializers.CharField(source='city.name', read_only=True)
    district_name = serializers.CharField(source='district.name', read_only=True)
    developer = serializers.PrimaryKeyRelatedField(read_only=True)
    developer_name = serializers.CharField(source='developer.company_name', read_only=True)
    is_favourite = serializers.SerializerMethodField()
    
    class Meta:
        model = ConstructionObject
        fields = [
            'id', 'name', 'description', 'country', 'country_name', 'city', 'city_name', 
            'district', 'district_name', 'property_type', 'comfort_type', 'amenities', 
            'ownership_type', 'area', 'project_status', 'completion_date', 'address', 
            'price_per_sqm', 'documentations_link', 'created_at', 'updated_at', 
            'is_published', 'images', 'developer', 'developer_name', 'is_favourite', 'floors','latitude', 'longitude'
        ]
    
    def get_is_favourite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favourited_by_objects.filter(id=request.user.id).exists()
        return False


class SupportMessageSerializer(serializers.ModelSerializer):
    """
    Сериализатор для сообщений поддержки
    """
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    
    class Meta:
        model = SupportMessage
        fields = [
            'id', 'sender', 'sender_name', 'sender_type', 
            'message', 'created_at'
        ]
        read_only_fields = ['id', 'sender', 'sender_type', 'created_at']


class SupportTicketSerializer(serializers.ModelSerializer):
    """
    Сериализатор для обращений в поддержку
    """
    messages = SupportMessageSerializer(many=True, read_only=True)
    creator_name = serializers.CharField(source='creator.get_full_name', read_only=True)
    manager_name = serializers.CharField(source='manager.get_full_name', read_only=True)
    
    class Meta:
        model = SupportTicket
        fields = [
            'id', 'creator', 'creator_name', 'manager', 'manager_name',
            'category', 'status', 'created_at', 'updated_at', 'messages'
        ]
        read_only_fields = ['id', 'creator', 'manager', 'created_at', 'updated_at']


class CreateSupportTicketSerializer(serializers.ModelSerializer):
    """
    Сериализатор для создания обращения в поддержку
    """
    message = serializers.CharField(write_only=True)
    
    class Meta:
        model = SupportTicket
        fields = ['category', 'message']
    
    def create(self, validated_data):
        message_text = validated_data.pop('message')
        ticket = SupportTicket.objects.create(
            creator=self.context['request'].user,
            **validated_data
        )
        
        SupportMessage.objects.create(
            ticket=ticket,
            sender=self.context['request'].user,
            sender_type='creator',
            message=message_text
        )
        
        return ticket


class SupportMessageCreateSerializer(serializers.ModelSerializer):
    """
    Сериализатор для создания сообщения в обращении
    """
    class Meta:
        model = SupportMessage
        fields = ['message']
    
    def create(self, validated_data):
        ticket_id = self.context['ticket_id']
        ticket = SupportTicket.objects.get(id=ticket_id)
        
        message = SupportMessage.objects.create(
            ticket=ticket,
            sender=self.context['request'].user,
            sender_type='creator',
            **validated_data
        )
        
        return message
