from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from django.db.models import Q
from .serializers import (
    RegisterSerializer, LoginSerializer, UserSerializer, 
    UserProfileUpdateSerializer, SupportTicketSerializer, 
    CreateSupportTicketSerializer, SupportMessageCreateSerializer
)
from users.models import UserActivityLog
from developers.models import ConstructionObject
from support.models import SupportTicket
from api.apps.users.serializers import ConstructionObjectSerializer

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



    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Получение профиля текущего пользователя (альтернативный endpoint)
        """
        return self.list(request)

    @action(detail=False, methods=['put', 'patch'])
    def update_me(self, request):
        """
        Обновление профиля текущего пользователя
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
        Получение списка агентов с фильтрацией и сортировкой
        """
        queryset = User.objects.filter(role='agent')
        
        # Фильтрация по стране
        country = request.query_params.get('country')
        if country:
            queryset = queryset.filter(country__name__icontains=country)
        
        # Поиск по названию компании
        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(company_name__icontains=search)
        
        # Сортировка
        sort = request.query_params.get('sort')
        if sort == 'name_asc':
            queryset = queryset.order_by('company_name')
        elif sort == 'name_desc':
            queryset = queryset.order_by('-company_name')
        elif sort == 'date_asc':
            queryset = queryset.order_by('date_joined')
        elif sort == 'date_desc':
            queryset = queryset.order_by('-date_joined')
        else:
            # По умолчанию сортируем по дате регистрации (новые сначала)
            queryset = queryset.order_by('-date_joined')
        
        serializer = UserSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def developers(self, request):
        """
        Получение списка застройщиков с фильтрацией и сортировкой
        """
        queryset = User.objects.filter(role='developer')
        
        # Фильтрация по стране
        country = request.query_params.get('country')
        if country:
            queryset = queryset.filter(country__name__icontains=country)
        
        # Поиск по названию компании
        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(company_name__icontains=search)
        
        # Сортировка
        sort = request.query_params.get('sort')
        if sort == 'name_asc':
            queryset = queryset.order_by('company_name')
        elif sort == 'name_desc':
            queryset = queryset.order_by('-company_name')
        elif sort == 'date_asc':
            queryset = queryset.order_by('date_joined')
        elif sort == 'date_desc':
            queryset = queryset.order_by('-date_joined')
        else:
            # По умолчанию сортируем по дате регистрации (новые сначала)
            queryset = queryset.order_by('-date_joined')
        
        serializer = UserSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def toggle_favourite(self, request, pk=None):
        """
        Добавление/удаление пользователя из избранного
        """
        try:
            user_to_toggle = User.objects.get(pk=pk)
            current_user = request.user
            
            # Определяем тип пользователя и соответствующее поле избранного
            if user_to_toggle.role == 'agent':
                if user_to_toggle in current_user.favourite_agents.all():
                    current_user.favourite_agents.remove(user_to_toggle)
                    is_favourite = False
                    action_text = "Удалил агента из избранного"
                else:
                    current_user.favourite_agents.add(user_to_toggle)
                    is_favourite = True
                    action_text = "Добавил агента в избранное"
            elif user_to_toggle.role == 'developer':
                if user_to_toggle in current_user.favourite_developers.all():
                    current_user.favourite_developers.remove(user_to_toggle)
                    is_favourite = False
                    action_text = "Удалил застройщика из избранного"
                else:
                    current_user.favourite_developers.add(user_to_toggle)
                    is_favourite = True
                    action_text = "Добавил застройщика в избранное"
            else:
                return Response(
                    {'error': 'Неподдерживаемый тип пользователя'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Логируем действие
            UserActivityLog.objects.create(
                user=current_user,
                action=action_text
            )
            
            return Response({
                'is_favourite': is_favourite,
                'message': 'Избранное обновлено'
            })
        except User.DoesNotExist:
            return Response(
                {'error': 'Пользователь не найден'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    


class ObjectViewSet(ViewSet):
    """
    ViewSet для работы с объектами недвижимости
    """
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """
        Получение списка объектов с фильтрацией
        """
        queryset = ConstructionObject.objects.filter(is_published=True)

        # Получаем параметры поиска из query params
        search = request.query_params.get('search')
        country = request.query_params.get('country')
        name = request.query_params.get('name')
        developer = request.query_params.get('developer')
        price_from = request.query_params.get('price_from')
        price_to = request.query_params.get('price_to')
        object_type = request.query_params.get('object_type')
        beach_distance_from = request.query_params.get('beach_distance_from')
        beach_distance_to = request.query_params.get('beach_distance_to')
        sort_by = request.query_params.get('sort_by', 'default')

        # Применяем фильтры
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(address__icontains=search)
            )
        if country:
            queryset = queryset.filter(country__name__icontains=country)
        if name:
            queryset = queryset.filter(name__icontains=name)
        if developer:
            queryset = queryset.filter(
                developer__company_name__icontains=developer)
        if price_from:
            queryset = queryset.filter(price_per_sqm__gte=price_from)
        if price_to:
            queryset = queryset.filter(price_per_sqm__lte=price_to)
        if object_type:
            queryset = queryset.filter(property_type=object_type)
        if beach_distance_from:
            queryset = queryset.filter(beach_distance__gte=beach_distance_from)
        if beach_distance_to:
            queryset = queryset.filter(beach_distance__lte=beach_distance_to)

        # Применяем сортировку
        if sort_by == 'alphabet':
            queryset = queryset.order_by('name')
        elif sort_by == 'region':
            queryset = queryset.order_by('address')
        else:
            # По умолчанию сортируем по дате создания (новые сначала)
            queryset = queryset.order_by('-created_at')

        serializer = ConstructionObjectSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """
        Получение детальной информации об объекте
        """
        try:
            obj = ConstructionObject.objects.get(pk=pk, is_published=True)
            serializer = ConstructionObjectSerializer(obj, context={'request': request})
            return Response(serializer.data)
        except ConstructionObject.DoesNotExist:
            return Response(
                {'error': 'Объект не найден'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def toggle_favourite(self, request, pk=None):
        """
        Добавление/удаление объекта из избранного
        """
        try:
            obj = ConstructionObject.objects.get(pk=pk, is_published=True)
            user = request.user
            
            if obj in user._favourite_objects.all():
                user._favourite_objects.remove(obj)
                is_favourite = False
                action_text = "Удалил объект из избранного"
            else:
                user._favourite_objects.add(obj)
                is_favourite = True
                action_text = "Добавил объект в избранное"
            
            # Логируем действие
            UserActivityLog.objects.create(
                user=user,
                action=action_text
            )
            
            return Response({
                'is_favourite': is_favourite,
                'message': 'Избранное обновлено'
            })
        except ConstructionObject.DoesNotExist:
            return Response(
                {'error': 'Объект не найден'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def favourites(self, request):
        """
        Получение списка избранных объектов пользователя
        """
        favourite_objects = request.user._favourite_objects.filter(is_published=True)
        serializer = ConstructionObjectSerializer(favourite_objects, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def other_objects(self, request, pk=None):
        """
        Получение других объектов от того же застройщика
        """
        try:
            obj = ConstructionObject.objects.get(pk=pk, is_published=True)
            other_objects = ConstructionObject.objects.filter(
                developer=obj.developer, 
                is_published=True
            ).exclude(pk=pk)[:10]  # Ограничиваем 4 объектами
            
            serializer = ConstructionObjectSerializer(other_objects, many=True, context={'request': request})
            return Response(serializer.data)
        except ConstructionObject.DoesNotExist:
            return Response(
                {'error': 'Объект не найден'}, 
                status=status.HTTP_404_NOT_FOUND
            )


class SupportViewSet(ViewSet):
    """
    ViewSet для работы с технической поддержкой
    """
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """
        Получение списка обращений пользователя
        """
        tickets = SupportTicket.objects.filter(creator=request.user).order_by('-created_at')
        serializer = SupportTicketSerializer(tickets, many=True, context={'request': request})
        return Response(serializer.data)

    def create(self, request):
        """
        Создание нового обращения
        """
        serializer = CreateSupportTicketSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            ticket = serializer.save()
            
            # Логируем действие
            UserActivityLog.objects.create(
                user=request.user,
                action="Создал обращение в поддержку"
            )
            
            return Response(
                SupportTicketSerializer(ticket, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        """
        Получение детальной информации об обращении
        """
        try:
            ticket = SupportTicket.objects.get(pk=pk, creator=request.user)
            serializer = SupportTicketSerializer(ticket, context={'request': request})
            return Response(serializer.data)
        except SupportTicket.DoesNotExist:
            return Response(
                {'error': 'Обращение не найдено'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def messages(self, request, pk=None):
        """
        Отправка сообщения в обращение
        """
        try:
            ticket = SupportTicket.objects.get(pk=pk, creator=request.user)
            
            if ticket.status == 'closed':
                return Response(
                    {'error': 'Нельзя отправлять сообщения в закрытое обращение'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            serializer = SupportMessageCreateSerializer(
                data=request.data, 
                context={'request': request, 'ticket_id': pk}
            )
            
            if serializer.is_valid():
                message = serializer.save()
                
                # Логируем действие
                UserActivityLog.objects.create(
                    user=request.user,
                    action=f"Отправил сообщение в обращение #{pk}"
                )
                
                return Response({
                    'message': 'Сообщение отправлено',
                    'message_id': message.id
                }, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except SupportTicket.DoesNotExist:
            return Response(
                {'error': 'Обращение не найдено'}, 
                status=status.HTTP_404_NOT_FOUND
            )