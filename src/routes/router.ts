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
	DeletePage,
	GetOptSumbits,
	EditFunnel,
	CreateFunnelFromTemplate,
	MakeFunnelAsTemplate,
	GetAllTemplates,
	UploadFile,
	DuplicateFunnel,
} from '../controllers'
import {Validateuser} from '../middlewares'

const router = express.Router()
//@ts-ignore
router.route('/new-funnel').post(Validateuser, NewFunnel)
//@ts-ignore
router.route('/get-funnel').get(Validateuser, GetFunnel)
//@ts-ignore
router.route('/new-page').post(Validateuser, NewPage)
//@ts-ignore
router.route('/get-page').get(Validateuser, GetPage)

//@ts-ignore
router.route('/my-funnels').get(Validateuser, GetMyFunnels)

//@ts-ignore
router.route('/page').put(Validateuser, EditPage)

//@ts-ignore
router.route('/page').delete(DeletePage)

//@ts-ignore
router.route('/publish').put(Validateuser, PublishPage)

//@ts-ignore
router.route('/toggle').put(Validateuser, ToggleActivateFunnel)

//@ts-ignore
router.route('/menu').post(Validateuser, AddNewMenu)

//@ts-ignore
router.route('/menu').delete(Validateuser, RemoveMenu)

//@ts-ignore
router.route('/menu').put(Validateuser, EditMenu)

//@ts-ignore
router.route('/funnel').delete(Validateuser, DeleteFunnel)

//@ts-ignore
router.route('/funnel').put(Validateuser, EditFunnel)

//@ts-ignore
router.route('/opt-form').post(InsertNewOptSubmit)

//@ts-ignore
router.route('/template').post(MakeFunnelAsTemplate)

//@ts-ignore
router.route('/template').get(GetAllTemplates)

//@ts-ignore
router.route('/template/funnel').post(CreateFunnelFromTemplate)

//@ts-ignore
router.route('/upload').post(UploadFile)

//@ts-ignore
router.route('/submits').get(GetOptSumbits)

//@ts-ignore
router.route('/duplicate-funnel').post(Validateuser, DuplicateFunnel)
export default router
