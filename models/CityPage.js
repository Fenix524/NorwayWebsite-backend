import mongoose from 'mongoose'
import { moreInfoTempleateSchema } from './MoreInfoTempleate.js'

export const CityPage = mongoose.model('City', moreInfoTempleateSchema)
