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
import { COLORS } from '../styles/colors';
import { financeStyles as styles } from '../styles/screens/finance';
import { commonStyles } from '../styles/components/common';

const FinanceScreen = ({ navigation }) => {
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
    { value: 'thailand', label: 'Таиланд' },
    { value: 'vietnam', label: 'Вьетнам' },
    { value: 'cambodia', label: 'Камбоджа' },
    { value: 'indonesia', label: 'Индонезия' },
    { value: 'malaysia', label: 'Малайзия' },
  ];

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Банковский перевод' },
    { value: 'credit_card', label: 'Кредитная карта' },
    { value: 'crypto', label: 'Криптовалюта' },
  ];

  useEffect(() => {
    loadFinanceData();
  }, []);

  const loadFinanceData = async () => {
    try {
      // Используем моковые данные для демонстрации
      const mockData = {
        balance: 1250.00,
        subscription: {
          isActive: true,
          daysLeft: 45,
          plan: 'Расширенный'
        },
        operations: [
          {
            id: 1,
            date: '15.12.2024 14:30',
            type: 'Пополнение',
            amount: 500.00,
            description: 'Пополнение баланса',
            status: 'Успешно'
          },
          {
            id: 2,
            date: '10.12.2024 09:15',
            type: 'Подписка',
            amount: -100.00,
            description: 'Оплата подписки',
            status: 'Успешно'
          },
          {
            id: 3,
            date: '05.12.2024 16:45',
            type: 'Вывод',
            amount: -200.00,
            description: 'Вывод средств',
            status: 'В обработке'
          }
        ],
        plans: [
          {
            id: 1,
            name: 'Базовый тариф',
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
            name: 'Партнерский тариф',
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
    Alert.alert('Информация', 'Функция продления подписки в разработке');
  };

  const handleSubscribe = () => {
    Alert.alert('Информация', 'Функция подписки в разработке');
  };

  const handleConnectPlan = (plan) => {
    Alert.alert('Информация', `Функция подключения тарифа "${plan.name}" в разработке`);
  };

  const handleCreateInvoice = () => {
    setShowInvoiceModal(true);
  };

  const handleSubmitInvoice = () => {
    if (!invoiceForm.country || !invoiceForm.paymentMethod || !invoiceForm.email) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }
    
    Alert.alert('Успех', 'Счет успешно создан и отправлен на указанный email');
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
        <Text style={commonStyles.errorText}>Не удалось загрузить данные</Text>
        <Button title="Повторить" onPress={loadFinanceData} style={commonStyles.button} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Финансы</Text>
        </View>

        {/* Основной экран с балансом и подпиской */}
        <View style={styles.mainScreen}>
          {/* Текущий баланс */}
          <View style={styles.balanceWrapper}>
            <Text style={styles.balanceAmount}>{financeData.balance.toFixed(2)} $</Text>
            <Text style={styles.balanceText}>Текущий баланс</Text>
          </View>

          {/* Подписка */}
          <View style={styles.subscriptionWrapper}>
            <Text style={styles.subscriptionText}>Действие подписки</Text>
            {financeData.subscription.isActive ? (
              <>
                <Text style={styles.subscriptionDays}>{financeData.subscription.daysLeft} дней</Text>
                <TouchableOpacity 
                  style={styles.subscriptionButton}
                  onPress={handleExtendSubscription}
                >
                  <Text style={styles.subscriptionButtonText}>Продлить</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.subscriptionDays}>Нет активной подписки</Text>
                <TouchableOpacity 
                  style={styles.subscriptionButton}
                  onPress={handleSubscribe}
                >
                  <Text style={styles.subscriptionButtonText}>Подписаться</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* История операций */}
        <View style={styles.operations}>
          <View style={styles.operationsHeader}>
            <Text style={styles.operationsTitle}>История операций</Text>
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
                <Text style={styles.emptyOperationsText}>Нет операций</Text>
              </View>
            )}
          </View>
        </View>

        {/* Доступные тарифы */}
        <View style={styles.pricingPlans}>
          <Text style={styles.pricingPlansTitle}>Доступные тарифы</Text>
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
                  <Text style={styles.pricingPlanButtonText}>Подключить</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Форма создания счета */}
        <View style={styles.invoiceForm}>
          <View style={styles.invoiceFormHeader}>
            <Text style={styles.invoiceFormTitle}>Формирование счета</Text>
          </View>
          <View style={styles.invoiceFormContent}>
            <Button 
              title="Создать счет"
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
                <Text style={styles.modalTitle}>Формирование счета</Text>
                <TouchableOpacity onPress={handleCancelInvoice} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {/* Страна */}
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Введите страну</Text>
                  <TouchableOpacity 
                    style={styles.dropdownButton}
                    onPress={() => {
                      Alert.alert(
                        'Выберите страну',
                        '',
                        countries.map(country => ({
                          text: country.label,
                          onPress: () => {
                            setSelectedCountry(country.label);
                            setInvoiceForm(prev => ({ ...prev, country: country.value }));
                          }
                        })).concat([{ text: 'Отмена', style: 'cancel' }])
                      );
                    }}
                  >
                    <Text style={[
                      styles.dropdownButtonText,
                      { color: selectedCountry ? COLORS.text : COLORS.gray }
                    ]}>
                      {selectedCountry || 'Выберите страну'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Способ оплаты */}
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Введите способ оплаты</Text>
                  <TouchableOpacity 
                    style={styles.dropdownButton}
                    onPress={() => {
                      Alert.alert(
                        'Выберите способ оплаты',
                        '',
                        paymentMethods.map(method => ({
                          text: method.label,
                          onPress: () => {
                            setSelectedPaymentMethod(method.label);
                            setInvoiceForm(prev => ({ ...prev, paymentMethod: method.value }));
                          }
                        })).concat([{ text: 'Отмена', style: 'cancel' }])
                      );
                    }}
                  >
                    <Text style={[
                      styles.dropdownButtonText,
                      { color: selectedPaymentMethod ? COLORS.text : COLORS.gray }
                    ]}>
                      {selectedPaymentMethod || 'Выберите способ оплаты'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Email */}
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Куда направить счет</Text>
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
                  <Text style={styles.cancelButtonText}>Отмена</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={handleSubmitInvoice}
                >
                  <Text style={styles.submitButtonText}>Отправить</Text>
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
