import { zCustomMutation, zCustomQuery } from 'convex-helpers/server/zod4';
import { NoOp } from 'convex-helpers/server/customFunctions';

import { mutation, query } from '../_generated/server';

export const zQuery = zCustomQuery(query, NoOp);
export const zMutation = zCustomMutation(mutation, NoOp);
