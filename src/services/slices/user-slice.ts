import {
  getUserApi,
  loginUserApi,
  logoutApi,
  refreshToken,
  registerUserApi,
  updateUserApi,
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

import type { TLoginData, TRegisterData } from '@api';
import type { TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
  updateError: string | null;
};

type TAuthTokens = {
  accessToken: string;
  refreshToken: string;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
  updateError: null,
};

const saveTokens = ({ accessToken, refreshToken }: TAuthTokens): void => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = (): void => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    saveTokens(response);
    return response.user;
  }
);

export const loginUser = createAsyncThunk('user/loginUser', async (data: TLoginData) => {
  const response = await loginUserApi(data);
  saveTokens(response);
  // воспроизвела кейс и увидела, что при сценарии, где юзер не завершает смену пароля и входит по старому, не очищается запись reset password, подумала, что ее тоже будет хорошо убрать
  // при успешном входе очищаю от записи reset password, если юзер при смене пароля не завершил процесс, вспомнив старый и залогинившись по нему
  localStorage.removeItem('resetPassword');
  return response.user;
});

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.clear(); // полная очистка данных сессии
});

/* Проверка авторизации при старте приложения. Если accessToken в cookie уже
   истёк, но refreshToken есть, сначала получаем новую пару токенов. */
export const checkUserAuth = createAsyncThunk('user/checkUserAuth', async () => {
  const hasAccessToken = Boolean(getCookie('accessToken'));
  const hasRefreshToken = Boolean(localStorage.getItem('refreshToken'));

  if (!hasAccessToken && !hasRefreshToken) {
    return null;
  }

  try {
    if (!hasAccessToken) {
      await refreshToken();
    }
    const response = await getUserApi();
    return response.user;
  } catch {
    clearTokens();
    return null;
  }
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUserLoading: (state) => state.isLoading,
    selectUserError: (state) => state.error,
    selectUpdateUserError: (state) => state.updateError,
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateError = action.error.message ?? null;
      });
  },
});

export const {
  selectUser,
  selectIsAuthChecked,
  selectUserLoading,
  selectUserError,
  selectUpdateUserError,
} = userSlice.selectors;
