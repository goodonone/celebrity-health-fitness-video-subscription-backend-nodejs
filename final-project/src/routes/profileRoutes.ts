import { Router } from 'express';
import { getAllProfiles, createProfile, getProfile, updateProfile, deleteProfile } from '../controllers/profileController'

const router = Router();

router.get('/', getAllProfiles);
router.post('/', createProfile);
 router.get('/:profileId', getProfile);
router.put('/:profileId', updateProfile);
router.delete('/:profileId', deleteProfile);

export default router;