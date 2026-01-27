
import { Semaphore } from "./semaphore";

export const imageLoadLimiter = new Semaphore(6);
