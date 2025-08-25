import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../styles/colors';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supportStyles as styles } from '../styles/screens/support';
import HelpIcon from '../components/icons/HelpIcon';
import ChatIcon from '../components/icons/ChatIcon';
import FileIcon from '../components/icons/FileIcon';
import SendIcon from '../components/icons/SendIcon';
import ApiClient from '../api/client';
import { useAuth } from '../hooks/useAuth';

const TicketDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { ticketId } = route.params;
  const { isAuthenticated, user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    if (isAuthenticated && ticketId) {
      loadTicketDetails();
    }
  }, [isAuthenticated, ticketId]);

  const loadTicketDetails = async () => {
    try {
      setLoading(true);
      const ticketData = await ApiClient.getSupportTicket(ticketId);
      setTicket(ticketData);
      setMessages(ticketData.messages || []);
    } catch (error) {
      console.error('Ошибка загрузки обращения:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить обращение');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      return;
    }

    try {
      setSending(true);
      const messageData = {
        message: newMessage.trim(),
      };

      await ApiClient.sendSupportMessage(ticketId, messageData);
      setNewMessage('');
      await loadTicketDetails(); // Перезагружаем для получения нового сообщения
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      Alert.alert('Ошибка', 'Не удалось отправить сообщение');
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = () => {
    // TODO: Реализовать загрузку файлов
    Alert.alert('Информация', 'Загрузка файлов будет доступна в следующем обновлении');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return COLORS.primary;
      case 'closed':
        return COLORS.gray;
      default:
        return COLORS.text;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open':
        return 'Открыто';
      case 'closed':
        return 'Закрыто';
      default:
        return status;
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case 'site':
        return 'Проблемы с сайтом';
      case 'payment':
        return 'Оплата';
      case 'account':
        return 'Личный кабинет';
      default:
        return category;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isUserMessage = (message) => {
    return message.sender === user?.id || message.sender_type === 'creator';
  };

  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach(message => {
      const date = formatDate(message.created_at);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });
    return grouped;
  };

  const getOperatorName = () => {
    if (ticket?.manager) {
      return ticket.manager.get_full_name || ticket.manager.full_name || 'Оператор';
    }
    return 'Оператор';
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Header title="Обращение" onBack={() => navigation.goBack()} />
        <View style={styles.centerContainer}>
          <Text style={styles.authMessage}>
            Для просмотра обращения необходимо войти в систему
          </Text>
        </View>
        <BottomNavigation navigation={navigation} activeTab="help" />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Обращение" onBack={() => navigation.goBack()} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Загрузка обращения...</Text>
        </View>
        <BottomNavigation navigation={navigation} activeTab="help" />
      </View>
    );
  }

  if (!ticket) {
    return (
      <View style={styles.container}>
        <Header title="Обращение" onBack={() => navigation.goBack()} />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Обращение не найдено</Text>
        </View>
        <BottomNavigation navigation={navigation} activeTab="help" />
      </View>
    );
  }

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Header title={`Обращение #${ticket.id}`} onBack={() => navigation.goBack()} />
        
        <View style={styles.ticketDetailHeader}>
          <View style={styles.ticketDetailInfo}>
            <Text style={styles.ticketCategory}>
              {getCategoryText(ticket.category)}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(ticket.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(ticket.status)}
              </Text>
            </View>
          </View>
        </View>

        {/* Информация об операторе */}
        {ticket.manager && (
          <View style={styles.operatorInfo}>
            <View style={styles.operatorPhoto}>
              {ticket.manager.profile_photo ? (
                <Image 
                  source={{ uri: ticket.manager.profile_photo }} 
                  style={styles.operatorPhotoImage}
                />
              ) : (
                <View style={styles.operatorPhotoPlaceholder}>
                  <Text style={styles.operatorPhotoText}>О</Text>
                </View>
              )}
            </View>
            <View style={styles.operatorDetails}>
              <Text style={styles.operatorName}>{getOperatorName()}</Text>
              <Text style={styles.operatorRole}>Оператор</Text>
            </View>
          </View>
        )}

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyMessages}>
              <ChatIcon width={48} height={48} color={COLORS.gray} />
              <Text style={styles.emptyMessagesText}>
                Пока нет сообщений в этом обращении
              </Text>
            </View>
          ) : (
            Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <View key={date}>
                <Text style={styles.dateSeparator}>{date}</Text>
                {dateMessages.map((message, index) => (
                  <View
                    key={message.id || index}
                    style={[
                      styles.messageContainer,
                      isUserMessage(message) ? styles.userMessage : styles.operatorMessage,
                    ]}
                  >
                    <View
                      style={[
                        styles.messageBubble,
                        isUserMessage(message) ? styles.userBubble : styles.operatorBubble,
                      ]}
                    >
                      <Text
                        style={[
                          styles.messageText,
                          isUserMessage(message) ? styles.userMessageText : styles.operatorMessageText,
                        ]}
                      >
                        {message.message}
                      </Text>
                      <Text
                        style={[
                          styles.messageTime,
                          isUserMessage(message) ? styles.userMessageTime : styles.operatorMessageTime,
                        ]}
                      >
                        {formatTime(message.created_at)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ))
          )}
        </ScrollView>

        {ticket.status === 'open' && (
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.messageInput}
                placeholder="Введите ваше сообщение..."
                placeholderTextColor={COLORS.gray}
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
                maxLength={1000}
              />
              <TouchableOpacity
                style={styles.fileButton}
                onPress={handleFileUpload}
              >
                <FileIcon width={20} height={20} color={COLORS.gray} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sendButton, sending && styles.sendButtonDisabled]}
                onPress={handleSendMessage}
                disabled={sending || !newMessage.trim()}
              >
                {sending ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <SendIcon width={20} height={20} color={COLORS.white} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
      <BottomNavigation navigation={navigation} activeTab="help" />
    </View>
  );
};

export default TicketDetailScreen;
