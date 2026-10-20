import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute,
} from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import { Preloader } from '@ui';
import { useCallback, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';

import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading,
} from '../../services/slices/ingredients-slice';
import { checkUserAuth } from '../../services/slices/user-slice';
import { useDispatch, useSelector } from '../../services/store';

import type { AppContentProps, TDetailsPageProps, TLocationState } from './type';

import '../../index.css';

import styles from './app.module.css';

const INGREDIENT_DETAILS_TITLE = 'Детали ингредиента';
const ORDER_NUMBER_LENGTH = 6;

const formatOrderNumber = (orderNumber = ''): string =>
  `#${orderNumber.padStart(ORDER_NUMBER_LENGTH, '0')}`;

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};

export default App;

const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const { background } = (location.state as TLocationState | null) ?? {};

  const handleModalClose = useCallback((): void => {
    void navigate(-1);
  }, [navigate]);

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route
          path="/feed/:number"
          element={
            <OrderDetailsPage>
              <OrderInfo />
            </OrderDetailsPage>
          }
        />
        <Route
          path="/ingredients/:id"
          element={
            <DetailsPage title={INGREDIENT_DETAILS_TITLE}>
              <IngredientDetails />
            </DetailsPage>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <OrderDetailsPage>
                <OrderInfo />
              </OrderDetailsPage>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/feed/:number"
            element={
              <OrderModal onClose={handleModalClose}>
                <OrderInfo />
              </OrderModal>
            }
          />
          <Route
            path="/ingredients/:id"
            element={
              <Modal title={INGREDIENT_DETAILS_TITLE} onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <OrderModal onClose={handleModalClose}>
                  <OrderInfo />
                </OrderModal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};

const DetailsPage = ({ title, children }: TDetailsPageProps): React.JSX.Element => (
  <div className={styles.detailPageWrap}>
    <h3 className={`${styles.detailHeader} text text_type_main-large`}>{title}</h3>
    {children}
  </div>
);

const OrderDetailsPage = ({
  children,
}: Omit<TDetailsPageProps, 'title'>): React.JSX.Element => {
  const { number } = useParams();

  return <DetailsPage title={formatOrderNumber(number)}>{children}</DetailsPage>;
};

const OrderModal = ({
  onClose,
  children,
}: Omit<TDetailsPageProps, 'title'> & { onClose: () => void }): React.JSX.Element => {
  const { number } = useParams();

  return (
    <Modal title={formatOrderNumber(number)} onClose={onClose}>
      {children}
    </Modal>
  );
};
