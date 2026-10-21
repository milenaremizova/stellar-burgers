import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import { selectIngredients } from '../../services/slices/ingredients-slice';
import { useSelector } from '../../services/store';

import styles from './ingredient-details.module.css';

const INGREDIENT_DETAILS_TITLE = 'Детали ингредиента';

export const IngredientDetails = (): React.JSX.Element => {
  // TODO: Взять переменную из стора
  const { id } = useParams();
  const ingredients = useSelector(selectIngredients);
  const ingredientData = ingredients.find((ingredient) => ingredient._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <>
      <h3 className={`${styles.title} text text_type_main-large`}>
        {INGREDIENT_DETAILS_TITLE}
      </h3>
      <IngredientDetailsUI ingredientData={ingredientData} />
    </>
  );
};
