import type { SerializedError } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils-types';
import type { ReactNode } from 'react';
import type { Location } from 'react-router-dom';

export type AppContentProps = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: SerializedError | null;
};

export type TDetailsPageProps = {
  // убран проп тайтл, чтобы его не требовало в detailspage
  children: ReactNode;
};

export type TLocationState = {
  background?: Location;
};
