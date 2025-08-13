from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from .serializers import (
    RegisterSerializer, LoginSerializer, UserSerializer, 
    UserProfileUpdateSerializer
)
from users.models import UserActivityLog

User = get_user_model()

class AuthViewSet(ViewSet):
    """
    ViewSet для аутентификации пользователей
    """
    permission_classes = [AllowAny]

    def create(self, request):
        """
        Регистрация нового пользователя
        """
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            
            # Логируем действие
            UserActivityLog.objects.create(
                user=user,
                action="Зарегистрировался через мобильное приложение"
            )
            
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data,
                'message': 'Регистрация успешна'
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        """
        Авторизация пользователя
        """
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            
            # Логируем действие
            UserActivityLog.objects.create(
                user=user,
                action="Вошёл через мобильное приложение"
            )
            
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data,
                'message': 'Вход выполнен успешно'
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """
        Выход из системы
        """
        try:
            request.user.auth_token.delete()
            UserActivityLog.objects.create(
                user=request.user,
                action="Вышел из мобильного приложения"
            )
            return Response({'message': 'Выход выполнен успешно'})
        except:
            return Response({'message': 'Ошибка при выходе'}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileViewSet(ViewSet):
    """
    ViewSet для работы с профилем пользователя
    """
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """
        Получение профиля текущего пользователя
        """
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def update(self, request):
        """
        Обновление профиля пользователя
        """
        serializer = UserProfileUpdateSerializer(
            request.user, 
            data=request.data, 
            partial=True
        )
        if serializer.is_valid():
            user = serializer.save()
            UserActivityLog.objects.create(
                user=user,
                action="Обновил профиль через мобильное приложение"
            )
            return Response({
                'user': UserSerializer(user).data,
                'message': 'Профиль обновлен успешно'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Получение профиля текущего пользователя (альтернативный endpoint)
        """
        return self.list(request)


class UserListViewSet(ViewSet):
    """
    ViewSet для работы со списками пользователей
    """
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """
        Получение списка пользователей с фильтрацией
        """
        queryset = User.objects.all()
        
        # Фильтрация по роли
        role = request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role)
        
        # Фильтрация по стране
        country = request.query_params.get('country')
        if country:
            queryset = queryset.filter(country__name__icontains=country)
        
        # Поиск по названию компании
        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(company_name__icontains=search)
        
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """
        Получение информации о конкретном пользователе
        """
        try:
            user = User.objects.get(pk=pk)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(
                {'error': 'Пользователь не найден'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def developers(self, request):
        """
        Получение списка застройщиков
        """
        developers = User.objects.filter(role='developer')
        serializer = UserSerializer(developers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def agents(self, request):
        """
        Получение списка агентов
        """
        agents = User.objects.filter(role='agent')
        serializer = UserSerializer(agents, many=True)
        return Response(serializer.data)