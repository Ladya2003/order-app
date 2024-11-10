import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, Heading } from '@chakra-ui/react';
import { useState } from 'react';
import { OrderFormOrganism } from './components/atomic/organisms/OrderForm';
import OrderListMolecule from './components/atomic/molecules/OrderList';
import { colors } from './theme/theme';

function App() {
  const [isCreating, setIsCreating] = useState(false);

  const toogleCreation = () => {
    setIsCreating(!isCreating);
  };

  return (
    <Flex
      gap="20px"
      direction="column"
      padding="40px"
      color={colors.primary.secondary}
    >
      <Flex justify="space-between" width="100%">
        <Heading fontSize="24px" color={colors.primary.secondary}>
          {isCreating ? 'Создание заказа' : 'Заказы'}
        </Heading>

        {!isCreating && (
          <Button
            onClick={toogleCreation}
            padding="10px"
            borderRadius="4px"
            display="flex"
            alignItems="center"
            gap="8px"
            fontSize="16px"
            fontWeight={500}
            bgColor={colors.secondary.button}
          >
            <AddIcon boxSize="15px" />
            Добавить заказ
          </Button>
        )}
      </Flex>

      {isCreating && <OrderFormOrganism setIsCreating={setIsCreating} />}

      {!isCreating && <OrderListMolecule />}
    </Flex>
  );
}

export default App;
