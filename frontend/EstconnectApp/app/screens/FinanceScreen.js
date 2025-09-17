import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
  Modal
} from 'react-native';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import Button from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { useTrans } from '../hooks/useTrans';
import { COLORS } from '../styles/colors';
import { financeStyles as styles } from '../styles/screens/finance';
import { commonStyles } from '../styles/components/common';

const FinanceScreen = ({ navigation }) => {
  const { currentLanguage } = useLanguage();
  const { trans, loadTranslations } = useTrans();
  const [financeData, setFinanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    country: '',
    paymentMethod: '',
    email: ''
  });
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  // Данные для выпадающих списков
  const countries = [
    { value: 'thailand', label: trans('Таиланд') },
    { value: 'vietnam', label: trans('Вьетнам') },
    { value: 'cambodia', label: trans('Камбоджа') },
    { value: 'indonesia', label: trans('Индонезия') },
    { value: 'malaysia', label: trans('Малайзия') },
  ];

  const paymentMethods = [
    { value: 'bank_transfer', label: trans('Банковский перевод') },
    { value: 'credit_card', label: trans('Кредитная карта') },
    { value: 'crypto', label: trans('Криптовалюта') },
  ];

  useEffect(() => {
    loadFinanceData();
    
    // Загружаем переводы для интерфейса
    loadTranslations([
      'Таиланд',
      'Вьетнам', 
      'Камбоджа',
      'Индонезия',
      'Малайзия',
      'Банковский перевод',
      'Кредитная карта',
      'Криптовалюта',
      'Расширенный',
      'Пополнение',
      'Подписка',
      'Вывод',
      'Успешно',
      'В обработке',
      'Базовый тариф',
      'Партнерский тариф',
      'Информация',
      'Функция продления подписки в разработке',
      'Функция подписки в разработке',
      'Ошибка',
      'Пожалуйста, заполните все поля',
      'Успех',
      'Счет успешно создан и отправлен на указанный email',
      'Не удалось загрузить данные',
      'Повторить',
      'Создать счет',
      'Выберите страну',
      'Отмена',
      'Выберите способ оплаты',
      'Пополнение баланса',
      'Оплата подписки',
      'Вывод средств',
      'Функция подключения тарифа',
      'в разработке',
      'Куда направить счет',
      'История операций',
      'Доступные тарифы',
      'Подключить',
      'Формирование счета',
      'Введите страну',
      'Введите способ оплаты',
      'Финансы',
      'Текущий баланс',
      'Действие подписки',
      'Продлить',
      'Нет активной подписки',
      'Подписаться',
      'Нет операций',
      'Отмена',
      'Отправить',
      'Вывод средств',
      'дней',
    ]);
  }, [currentLanguage]);

  const loadFinanceData = async () => {
    try {
      // Используем моковые данные для демонстрации
      const mockData = {
        balance: 1250.00,
        subscription: {
          isActive: true,
          daysLeft: 45,
          plan: trans('Расширенный')
        },
        operations: [
          {
            id: 1,
            date: '15.12.2024 14:30',
            type: trans('Пополнение'),
            amount: 500.00,
            description: trans('Пополнение баланса'),
            status: trans('Успешно')
          },
          {
            id: 2,
            date: '10.12.2024 09:15',
            type: trans('Подписка'),
            amount: -100.00,
            description: trans('Оплата подписки'),
            status: trans('Успешно')
          },
          {
            id: 3,
            date: '05.12.2024 16:45',
            type: trans('Вывод'),
            amount: -200.00,
            description: trans('Вывод средств'),
            status: trans('В обработке')
          }
        ],
        plans: [
          {
            id: 1,
            name: trans('Базовый тариф'),
            price: 50,
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s'
          },
          {
            id: 2,
            name: 'Расширенный с Due diligence',
            price: 100,
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'sLorem Ipsum is simply dummy text of the'
          },
          {
            id: 3,
            name: trans('Партнерский тариф'),
            price: 150,
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'sLorem Ipsum is simply dummy text of the Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem'
          }
        ]
      };
      
      setFinanceData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleExtendSubscription = () => {
    Alert.alert(trans('Информация'), trans('Функция продления подписки в разработке'));
  };

  const handleSubscribe = () => {
    Alert.alert(trans('Информация'), trans('Функция подписки в разработке'));
  };

  const handleConnectPlan = (plan) => {
    Alert.alert(trans('Информация'), `${trans('Функция подключения тарифа')} "${plan.name}" ${trans('в разработке')}`);
  };

  const handleCreateInvoice = () => {
    setShowInvoiceModal(true);
  };

  const handleSubmitInvoice = () => {
    if (!invoiceForm.country || !invoiceForm.paymentMethod || !invoiceForm.email) {
      Alert.alert(trans('Ошибка'), trans('Пожалуйста, заполните все поля'));
      return;
    }
    
    Alert.alert(trans('Успех'), trans('Счет успешно создан и отправлен на указанный email'));
    setShowInvoiceModal(false);
    setInvoiceForm({ country: '', paymentMethod: '', email: '' });
    setSelectedCountry('');
    setSelectedPaymentMethod('');
  };

  const handleCancelInvoice = () => {
    setShowInvoiceModal(false);
    setInvoiceForm({ country: '', paymentMethod: '', email: '' });
    setSelectedCountry('');
    setSelectedPaymentMethod('');
  };

  if (loading) {
    return (
      <View style={commonStyles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={commonStyles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  if (!financeData) {
    return (
      <View style={commonStyles.errorContainer}>
        <Text style={commonStyles.errorText}>{trans('Не удалось загрузить данные')}</Text>
        <Button title={trans('Повторить')} onPress={loadFinanceData} style={commonStyles.button} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{trans('Финансы')}</Text>
        </View>

        {/* Основной экран с балансом и подпиской */}
        <View style={styles.mainScreen}>
          {/* Текущий баланс */}
          <View style={styles.balanceWrapper}>
            <Text style={styles.balanceAmount}>{financeData.balance.toFixed(2)} $</Text>
            <Text style={styles.balanceText}>{trans('Текущий баланс')}</Text>
          </View>

          {/* Подписка */}
          <View style={styles.subscriptionWrapper}>
            <Text style={styles.subscriptionText}>{trans('Действие подписки')}</Text>
            {financeData.subscription.isActive ? (
              <>
                <Text style={styles.subscriptionDays}>{financeData.subscription.daysLeft} {trans('дней')}</Text>
                <TouchableOpacity 
                  style={styles.subscriptionButton}
                  onPress={handleExtendSubscription}
                >
                  <Text style={styles.subscriptionButtonText}>{trans('Продлить')}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.subscriptionDays}>{trans('Нет активной подписки')}</Text>
                <TouchableOpacity 
                  style={styles.subscriptionButton}
                  onPress={handleSubscribe}
                >
                  <Text style={styles.subscriptionButtonText}>{trans('Подписаться')}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* История операций */}
        <View style={styles.operations}>
          <View style={styles.operationsHeader}>
            <Text style={styles.operationsTitle}>{trans('История операций')}</Text>
          </View>
          
          <View style={styles.operationsList}>
            {financeData.operations.length > 0 ? (
              financeData.operations.map((operation) => (
                <View key={operation.id} style={styles.operationRow}>
                  <View style={styles.operationDate}>
                    <Text style={styles.operationDateText}>{operation.date}</Text>
                  </View>
                  <View style={styles.operationType}>
                    <Text style={styles.operationTypeText}>{operation.type}</Text>
                  </View>
                  <View style={styles.operationAmount}>
                    <Text style={[
                      styles.operationAmountText,
                      { color: operation.amount > 0 ? COLORS.success : COLORS.error }
                    ]}>
                      {operation.amount > 0 ? '+' : ''}{operation.amount.toFixed(2)}$
                    </Text>
                  </View>
                  <View style={styles.operationDescription}>
                    <Text style={styles.operationDescriptionText}>{operation.description}</Text>
                  </View>
                  <View style={styles.operationStatus}>
                    <Text style={styles.operationStatusText}>{operation.status}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyOperations}>
                <Text style={styles.emptyOperationsText}>{trans('Нет операций')}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Доступные тарифы */}
        <View style={styles.pricingPlans}>
          <Text style={styles.pricingPlansTitle}>{trans('Доступные тарифы')}</Text>
          <View style={styles.pricingPlansList}>
            {financeData.plans.map((plan) => (
              <View key={plan.id} style={styles.pricingPlanItem}>
                <View style={styles.pricingPlanInfo}>
                  <Text style={styles.pricingPlanTitle}>{plan.name}</Text>
                  <Text style={styles.pricingPlanPrice}>{plan.price}$</Text>
                  <Text style={styles.pricingPlanDescription}>{plan.description}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.pricingPlanButton}
                  onPress={() => handleConnectPlan(plan)}
                >
                  <Text style={styles.pricingPlanButtonText}>{trans('Подключить')}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Форма создания счета */}
        <View style={styles.invoiceForm}>
          <View style={styles.invoiceFormHeader}>
            <Text style={styles.invoiceFormTitle}>{trans('Формирование счета')}</Text>
          </View>
          <View style={styles.invoiceFormContent}>
            <Button 
              title={trans('Создать счет')}
              onPress={handleCreateInvoice}
              style={styles.invoiceFormButton}
            />
          </View>
        </View>

        {/* Модальное окно создания счета */}
        <Modal
          visible={showInvoiceModal}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCancelInvoice}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{trans('Формирование счета')}</Text>
                <TouchableOpacity onPress={handleCancelInvoice} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {/* Страна */}
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>{trans('Введите страну')}</Text>
                  <TouchableOpacity 
                    style={styles.dropdownButton}
                    onPress={() => {
                      Alert.alert(
                        trans('Выберите страну'),
                        '',
                        countries.map(country => ({
                          text: country.label,
                          onPress: () => {
                            setSelectedCountry(country.label);
                            setInvoiceForm(prev => ({ ...prev, country: country.value }));
                          }
                        })).concat([{ text: trans('Отмена'), style: 'cancel' }])
                      );
                    }}
                  >
                    <Text style={[
                      styles.dropdownButtonText,
                      { color: selectedCountry ? COLORS.text : COLORS.gray }
                    ]}>
                      {selectedCountry || trans('Выберите страну')}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Способ оплаты */}
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>{trans('Введите способ оплаты')}</Text>
                  <TouchableOpacity 
                    style={styles.dropdownButton}
                    onPress={() => {
                      Alert.alert(
                        trans('Выберите способ оплаты'),
                        '',
                        paymentMethods.map(method => ({
                          text: method.label,
                          onPress: () => {
                            setSelectedPaymentMethod(method.label);
                            setInvoiceForm(prev => ({ ...prev, paymentMethod: method.value }));
                          }
                        })).concat([{ text: trans('Отмена'), style: 'cancel' }])
                      );
                    }}
                  >
                    <Text style={[
                      styles.dropdownButtonText,
                      { color: selectedPaymentMethod ? COLORS.text : COLORS.gray }
                    ]}>
                      {selectedPaymentMethod || trans('Выберите способ оплаты')}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Email */}
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>{trans('Куда направить счет')}</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Введите email для счета"
                    placeholderTextColor={COLORS.gray}
                    value={invoiceForm.email}
                    onChangeText={(text) => setInvoiceForm(prev => ({ ...prev, email: text }))}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={handleCancelInvoice}
                >
                  <Text style={styles.cancelButtonText}>{trans('Отмена')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={handleSubmitInvoice}
                >
                  <Text style={styles.submitButtonText}>{trans('Отправить')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
      <BottomNavigation navigation={navigation} activeTab="finance" />
    </View>
  );
};

export default FinanceScreen;
