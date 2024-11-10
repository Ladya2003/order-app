# order-app

Test task for DM-17

How to launch: npm i, npm start

when getting error in ./node_modules/@chakra-ui/icons/dist/esm/Spinner.mjs 4:20-30
you must change import forwardRef from @chakra-ui/react to react like that:
import { forwardRef, useId } from 'react';

delete node_modules/.cache and restart server with npm start
