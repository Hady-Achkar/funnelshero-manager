import express from 'express'
import {
	AddNewMenu,
	EditMenu,
	EditPage,
	GetFunnel,
	GetMyFunnels,
	GetPage,
	InsertNewOptSubmit,
	NewFunnel,
	NewPage,
	PublishPage,
	RemoveMenu,
	ToggleActivateFunnel,
	DeleteFunnel,
} from '../controllers'

const router = express.Router()
//@ts-ignore
router.route('/new-funnel').post(NewFunnel)
//@ts-ignore
router.route('/get-funnel').get(GetFunnel)
//@ts-ignore
router.route('/new-page').post(NewPage)
//@ts-ignore
router.route('/get-page').get(GetPage)

router.route('/opt-form').post(InsertNewOptSubmit)

//@ts-ignore
router.route('/my-funnels').get(GetMyFunnels)

//@ts-ignore
router.route('/page').put(EditPage)

//@ts-ignore
router.route('/publish').put(PublishPage)

//@ts-ignore
router.route('/toggle').put(ToggleActivateFunnel)

//@ts-ignore
router.route('/menu').post(AddNewMenu)

//@ts-ignore
router.route('/menu').delete(RemoveMenu)

//@ts-ignore
router.route('/menu').put(EditMenu)


//@ts-ignore
router.route('/funnel').delete(DeleteFunnel)
export default router
