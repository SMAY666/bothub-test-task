import './constants/env';
import {run} from './run';


run()
    .catch(() => process.exit(1));
