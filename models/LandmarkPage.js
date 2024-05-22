import mongoose from 'mongoose'
import { moreInfoTempleateSchema } from './MoreInfoTempleate.js'

export const LandmarkPage = mongoose.model('Landmark', moreInfoTempleateSchema)
