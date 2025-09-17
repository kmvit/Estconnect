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
import { useLanguage } from '../contexts/LanguageContext';
import { useTrans } from '../hooks/useTrans';
import ApiClient from '../api/client';
import { useAuth } from '../hooks/useAuth';

const CreateTicketScreen = () => {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const { currentLanguage } = useLanguage();
  const { trans, loadTranslations } = useTrans();
  const [category, setCategory] = useState('site');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Загружаем переводы при инициализации
  React.useEffect(() => {
    loadTranslations([
      'Проблемы с сайтом',
      'Оплата',
      'Личный кабинет',
      'Технические вопросы',
      'Другое',
      'Ошибка',
      'Пожалуйста, введите сообщение',
      'Успех',
      'Обращение создано успешно',
      'ОК',
      'Ошибка создания обращения:',
      'Не удалось создать обращение. Попробуйте еще раз.',
      'Внимание',
      'У вас есть несохраненные изменения. Вы уверены, что хотите выйти?',
      'Отмена',
      'Выйти',
      'Создать обращение',
      'Категория',
      'Категория обращения',
      'Сообщение',
      'Опишите вашу проблему или вопрос...',
      'Отправить',
    ]);
  }, [currentLanguage]);

  const categories = [
    { key: 'site', label: trans('Проблемы с сайтом') },
    { key: 'payment', label: trans('Оплата') },
    { key: 'account', label: trans('Личный кабинет') },
  ];

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert(trans('Ошибка'), trans('Пожалуйста, введите сообщение'));
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
      console.error(trans('Ошибка создания обращения:'), error);
      Alert.alert(trans('Ошибка'), trans('Не удалось создать обращение. Попробуйте еще раз.'));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (message.trim()) {
      Alert.alert(
        trans('Внимание'),
        trans('У вас есть несохраненные изменения. Вы уверены, что хотите выйти?'),
        [
          { text: trans('Отмена'), style: 'cancel' },
          { text: trans('Выйти'), onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Header title={trans('Создать обращение')} onBack={handleBack} />
        <View style={styles.centerContainer}>
          <Text style={styles.authMessage}>
            {trans('Для создания обращения необходимо войти в систему')}
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
          <Text style={styles.createHeaderTitle}>{trans('Новое обращение')}</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>{trans('Категория обращения')}</Text>
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

          <Text style={styles.formLabel}>{trans('Сообщение')}</Text>
          <TextInput
            style={styles.messageInput}
            placeholder={trans('Опишите вашу проблему или вопрос...')}
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
              <Text style={styles.submitButtonText}>{trans('Отправить')}</Text> 
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavigation navigation={navigation} activeTab="help" />
    </View>
  );
};

export default CreateTicketScreen;
