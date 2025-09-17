import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../styles/colors';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { useNavigation } from '@react-navigation/native';
import { supportStyles as styles } from '../styles/screens/support';
import HelpIcon from '../components/icons/HelpIcon';
import ChatIcon from '../components/icons/ChatIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { useTrans } from '../hooks/useTrans';
import ApiClient from '../api/client';
import { useAuth } from '../hooks/useAuth';

const SupportScreen = () => {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const { currentLanguage } = useLanguage();
  const { trans, loadTranslations } = useTrans();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadTickets();
    }
    
    // Загружаем переводы для интерфейса
    loadTranslations([
      'Поддержка',
      'Ошибка загрузки обращений:',
      'Не удалось загрузить обращения',
      'Открыто',
      'Закрыто',
      'В работе',
      'Неизвестно',
      'Проблемы с сайтом',
      'Оплата',
      'Личный кабинет',
      'Технические вопросы',
      'Другое',
      'Пользователь',
      'Загрузка...',
      'Обновление...',
      'Загрузка обращений...',
      'Для доступа к поддержке необходимо войти в систему',
      'Техническая поддержка',
      'Создать обращение',
      'Повторить',
      'У вас пока нет обращений',
      'Создайте первое обращение, если у вас есть вопросы или проблемы',
      'Обращение',
      'Просмотреть',
      'Проблемы с сайтом',
      'Оплата',
      'Личный кабинет',
      'Технические вопросы'
    ]);
  }, [isAuthenticated, currentLanguage]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiClient.getSupportTickets();
      // Обрабатываем разные форматы ответа
      const ticketsData = response.results || response || [];
      setTickets(Array.isArray(ticketsData) ? ticketsData : []);
    } catch (error) {
      console.error(trans('Ошибка загрузки обращений:'), error);
      setError(trans('Не удалось загрузить обращения'));
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTickets();
    setRefreshing(false);
  };

  const handleCreateTicket = () => {
    navigation.navigate('CreateTicket');
  };

  const handleTicketPress = (ticket) => {
    navigation.navigate('TicketDetail', { ticketId: ticket.id });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return '#34C759';
      case 'closed':
        return '#8E8E93';
      case 'in_progress':
        return '#FF9500';
      default:
        return COLORS.primary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open':
        return trans('Открыто');
      case 'closed':
        return trans('Закрыто');
      case 'in_progress':
        return trans('В работе');
      default:
        return status || trans('Неизвестно');
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case 'site':
        return trans('Проблемы с сайтом');
      case 'payment':
        return trans('Оплата');
      case 'account':
        return trans('Личный кабинет');
      case 'technical':
        return trans('Технические вопросы');
      case 'other':
        return trans('Другое');
      default:
        return category || trans('Неизвестно');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      return '';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return '';
    }
  };

  const getLastMessage = (ticket) => {
    if (!ticket.messages || !Array.isArray(ticket.messages) || ticket.messages.length === 0) {
      return null;
    }
    return ticket.messages[ticket.messages.length - 1];
  };

  const getSenderName = (message) => {
    if (!message || !message.sender) return trans('Пользователь');
    
    // Проверяем разные возможные форматы имени
    if (message.sender.get_full_name) {
      return message.sender.get_full_name;
    }
    if (message.sender.full_name) {
      return message.sender.full_name;
    }
    if (message.sender.first_name && message.sender.last_name) {
      return `${message.sender.first_name} ${message.sender.last_name}`;
    }
    if (message.sender.username) {
      return message.sender.username;
    }
    return trans('Пользователь');
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Header title={trans('Поддержка')} />
        <View style={styles.centerContainer}>
          <Text style={styles.authMessage}>
            {trans('Для доступа к поддержке необходимо войти в систему')}
          </Text>
        </View>
        <BottomNavigation navigation={navigation} activeTab="help" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Поддержка" />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{trans('Техническая поддержка')}</Text>
          </View>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateTicket}
          >
            <Text style={styles.createButtonText}>{trans('Создать обращение')}</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>{trans('Загрузка обращений...')}</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadTickets}>
              <Text style={styles.retryButtonText}>{trans('Повторить')}</Text>
            </TouchableOpacity>
          </View>
        ) : tickets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ChatIcon width={64} height={64} color={COLORS.gray} />
            <Text style={styles.emptyTitle}>{trans('У вас пока нет обращений')}</Text>
            <Text style={styles.emptyText}>
              {trans('Создайте первое обращение, если у вас есть вопросы или проблемы')}
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateTicket}
            >
              <Text style={styles.createButtonText}>{trans('Создать обращение')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.ticketsContainer}>
            {tickets.map((ticket) => {
              const lastMessage = getLastMessage(ticket);
              return (
                <View key={ticket.id} style={styles.ticketCard}>
                  <View style={styles.ticketHeader}>
                    <View style={styles.ticketInfo}>
                      <View style={styles.statusBadgeContainer}>
                        <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
                          {getStatusText(ticket.status)}
                        </Text>
                      </View>
                      <Text style={styles.ticketDate}>{formatDate(ticket.created_at)}</Text>
                      <Text style={styles.ticketId}>{trans('Обращение')} #{ticket.id}</Text>
                      <Text style={styles.ticketCategory}>{getCategoryText(ticket.category)}</Text>
                      {lastMessage && (
                        <>
                          <Text style={styles.lastMessageInfo}>
                            {getSenderName(lastMessage)} {formatTime(lastMessage.created_at)}
                          </Text>
                          <Text style={styles.lastMessage} numberOfLines={3}>
                            {lastMessage.message}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                  <View style={styles.ticketFooter}>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() => handleTicketPress(ticket)}
                    >
                      <Text style={styles.viewButtonText}>{trans('Просмотреть')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
      <BottomNavigation navigation={navigation} activeTab="help" />
    </View>
  );
};

export default SupportScreen;
