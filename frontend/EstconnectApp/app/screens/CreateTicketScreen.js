import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../styles/colors';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { useNavigation } from '@react-navigation/native';
import { supportStyles as styles } from '../styles/screens/support';
import HelpIcon from '../components/icons/HelpIcon';
import ApiClient from '../api/client';
import { useAuth } from '../hooks/useAuth';

const CreateTicketScreen = () => {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const [category, setCategory] = useState('site');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    { key: 'site', label: 'Проблемы с сайтом' },
    { key: 'payment', label: 'Оплата' },
    { key: 'account', label: 'Личный кабинет' },
  ];

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, введите сообщение');
      return;
    }

    try {
      setLoading(true);
      const ticketData = {
        category,
        message: message.trim(),
      };

      await ApiClient.createSupportTicket(ticketData);
      Alert.alert(
        'Успех',
        'Обращение создано успешно',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Support'),
          },
        ]
      );
    } catch (error) {
      console.error('Ошибка создания обращения:', error);
      Alert.alert('Ошибка', 'Не удалось создать обращение. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (message.trim()) {
      Alert.alert(
        'Внимание',
        'У вас есть несохраненные изменения. Вы уверены, что хотите выйти?',
        [
          { text: 'Отмена', style: 'cancel' },
          { text: 'Выйти', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Header title="Создать обращение" onBack={handleBack} />
        <View style={styles.centerContainer}>
          <Text style={styles.authMessage}>
            Для создания обращения необходимо войти в систему
          </Text>
        </View>
        <BottomNavigation navigation={navigation} activeTab="help" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Создать обращение" onBack={handleBack} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.createHeader}>
          <Text style={styles.createHeaderTitle}>Новое обращение</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Категория обращения</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.categoryButton,
                  category === cat.key && styles.categoryButtonActive,
                ]}
                onPress={() => setCategory(cat.key)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    category === cat.key && styles.categoryButtonTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.formLabel}>Сообщение</Text>
          <TextInput
            style={styles.messageInput}
            placeholder="Опишите вашу проблему или вопрос..."
            placeholderTextColor={COLORS.gray}
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="top"
            numberOfLines={8}
          />

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.submitButtonText}>Отправить обращение</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavigation navigation={navigation} activeTab="help" />
    </View>
  );
};

export default CreateTicketScreen;
