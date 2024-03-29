/* USER CODE BEGIN Header */
/**
 ******************************************************************************
 * File Name          : App/custom_app.c
 * Description        : Custom Example Application (Server)
 ******************************************************************************
  * @attention
  *
  * <h2><center>&copy; Copyright (c) 2021 STMicroelectronics.
  * All rights reserved.</center></h2>
  *
  * This software component is licensed by ST under Ultimate Liberty license
  * SLA0044, the "License"; You may not use this file except in compliance with
  * the License. You may obtain a copy of the License at:
  *                             www.st.com/SLA0044
  *
 ******************************************************************************
 */
/* USER CODE END Header */

/* Includes ------------------------------------------------------------------*/
#include "main.h"
#include "app_common.h"
#include "dbg_trace.h"
#include "ble.h"
#include "custom_app.h"
#include "custom_stm.h"
#include "stm32_seq.h"

/* Private includes ----------------------------------------------------------*/
/* USER CODE BEGIN Includes */

/* USER CODE END Includes */

/* Private typedef -----------------------------------------------------------*/
typedef struct
{
  /* battery_service */
  uint8_t               Bval_Notification_Status;
  /* eeg_service */
  uint8_t               Val_Notification_Status;
/* USER CODE BEGIN CUSTOM_APP_Context_t */
  uint16_t               BAT_VAL;
  uint16_t               EEG_VAL;
  uint16_t 				 STEP;
  uint8_t 				 TIMER;
/* USER CODE END CUSTOM_APP_Context_t */

  uint16_t              ConnectionHandle;
} Custom_App_Context_t;

/* USER CODE BEGIN PTD */
ADC_HandleTypeDef hadc1;
/* USER CODE END PTD */

/* Private defines ------------------------------------------------------------*/
/* USER CODE BEGIN PD */
#define eeg_chnge_step 10
#define eeg_chnge_period (0.01*1000*1000/CFG_TS_TICK_VAL) /*100ms*/
#define eeg_val_max 350
#define eeg_val_min 100
/* USER CODE END PD */

/* Private macros -------------------------------------------------------------*/
/* USER CODE BEGIN PM */

/* USER CODE END PM */

/* Private variables ---------------------------------------------------------*/
/**
 * START of Section BLE_APP_CONTEXT
 */

PLACE_IN_SECTION("BLE_APP_CONTEXT") static Custom_App_Context_t Custom_App_Context;

/**
 * END of Section BLE_APP_CONTEXT
 */

/* USER CODE BEGIN PV */
uint8_t UpdateCharData[247];
uint8_t NotifyCharData[247];

uint8_t SecureReadData;

/* USER CODE END PV */

/* Private function prototypes -----------------------------------------------*/
  /* battery_service */
static void Custom_Bval_Update_Char(void);
static void Custom_Bval_Send_Notification(void);
  /* eeg_service */
static void Custom_Val_Update_Char(void);
static void Custom_Val_Send_Notification(void);

/* USER CODE BEGIN PFP */
static void callback(void);
/* USER CODE END PFP */

/* Functions Definition ------------------------------------------------------*/
void Custom_STM_App_Notification(Custom_STM_App_Notification_evt_t *pNotification)
{
/* USER CODE BEGIN CUSTOM_STM_App_Notification_1 */

/* USER CODE END CUSTOM_STM_App_Notification_1 */
  switch(pNotification->Custom_Evt_Opcode)
  {
/* USER CODE BEGIN CUSTOM_STM_App_Notification_Custom_Evt_Opcode */

/* USER CODE END CUSTOM_STM_App_Notification_Custom_Evt_Opcode */

  /* battery_service */
    case CUSTOM_STM_BVAL_READ_EVT:
/* USER CODE BEGIN CUSTOM_STM_BVAL_READ_EVT */
    	UTIL_SEQ_SetTask(1<<CFG_TASK_NOTIFY_BATT,CFG_SCH_PRIO_0);
/* USER CODE END CUSTOM_STM_BVAL_READ_EVT */
      break;

    case CUSTOM_STM_BVAL_NOTIFY_ENABLED_EVT:
/* USER CODE BEGIN CUSTOM_STM_BVAL_NOTIFY_ENABLED_EVT */
    	Custom_App_Context.Bval_Notification_Status=1;
    	HAL_GPIO_WritePin(GPIOB, GPIO_PIN_1,GPIO_PIN_SET);
//    	HW_TS_Start(Custom_App_Context.TIMER,eeg_chnge_period);
/* USER CODE END CUSTOM_STM_BVAL_NOTIFY_ENABLED_EVT */
      break;

    case CUSTOM_STM_BVAL_NOTIFY_DISABLED_EVT:
/* USER CODE BEGIN CUSTOM_STM_BVAL_NOTIFY_DISABLED_EVT */
    	Custom_App_Context.Bval_Notification_Status=0;
    	HAL_GPIO_WritePin(GPIOB, GPIO_PIN_1,GPIO_PIN_RESET);
//    	HW_TS_Stop(Custom_App_Context.TIMER);
/* USER CODE END CUSTOM_STM_BVAL_NOTIFY_DISABLED_EVT */
      break;

  /* eeg_service */
    case CUSTOM_STM_VAL_READ_EVT:
/* USER CODE BEGIN CUSTOM_STM_VAL_READ_EVT */
    	UTIL_SEQ_SetTask(1<<CFG_TASK_NOTIFY_TEMP,CFG_SCH_PRIO_0);
/* USER CODE END CUSTOM_STM_VAL_READ_EVT */
      break;

    case CUSTOM_STM_VAL_NOTIFY_ENABLED_EVT:
/* USER CODE BEGIN CUSTOM_STM_VAL_NOTIFY_ENABLED_EVT */
//    	HW_TS_Start(Custom_App_Context.TIMER,eeg_chnge_period);
    	Custom_App_Context.Val_Notification_Status=1;
    	HAL_GPIO_WritePin(GPIOB, GPIO_PIN_5,GPIO_PIN_SET);
    	HW_TS_Start(Custom_App_Context.TIMER,eeg_chnge_period);
/* USER CODE END CUSTOM_STM_VAL_NOTIFY_ENABLED_EVT */
      break;

    case CUSTOM_STM_VAL_NOTIFY_DISABLED_EVT:
/* USER CODE BEGIN CUSTOM_STM_VAL_NOTIFY_DISABLED_EVT */
    	Custom_App_Context.Val_Notification_Status=0;
    	HAL_GPIO_WritePin(GPIOB, GPIO_PIN_5,GPIO_PIN_RESET);
     	HW_TS_Stop(Custom_App_Context.TIMER);
/* USER CODE END CUSTOM_STM_VAL_NOTIFY_DISABLED_EVT */
      break;

    default:
/* USER CODE BEGIN CUSTOM_STM_App_Notification_default */

/* USER CODE END CUSTOM_STM_App_Notification_default */
      break;
  }
/* USER CODE BEGIN CUSTOM_STM_App_Notification_2 */

/* USER CODE END CUSTOM_STM_App_Notification_2 */
  return;
}

void Custom_APP_Notification(Custom_App_ConnHandle_Not_evt_t *pNotification)
{
/* USER CODE BEGIN CUSTOM_APP_Notification_1 */

/* USER CODE END CUSTOM_APP_Notification_1 */

  switch(pNotification->Custom_Evt_Opcode)
  {
/* USER CODE BEGIN CUSTOM_APP_Notification_Custom_Evt_Opcode */

/* USER CODE END P2PS_CUSTOM_Notification_Custom_Evt_Opcode */
  case CUSTOM_CONN_HANDLE_EVT :
/* USER CODE BEGIN CUSTOM_CONN_HANDLE_EVT */


/* USER CODE END CUSTOM_CONN_HANDLE_EVT */
    break;

    case CUSTOM_DISCON_HANDLE_EVT :
/* USER CODE BEGIN CUSTOM_DISCON_HANDLE_EVT */
    	Custom_App_Context.Val_Notification_Status=0;
    	Custom_App_Context.Bval_Notification_Status=0;
    	HAL_GPIO_WritePin(GPIOB, GPIO_PIN_5,GPIO_PIN_RESET);
    	HAL_GPIO_WritePin(GPIOB, GPIO_PIN_1,GPIO_PIN_RESET);
/* USER CODE END CUSTOM_DISCON_HANDLE_EVT */
    break;

    default:
/* USER CODE BEGIN CUSTOM_APP_Notification_default */

/* USER CODE END CUSTOM_APP_Notification_default */
      break;
  }

/* USER CODE BEGIN CUSTOM_APP_Notification_2 */

/* USER CODE END CUSTOM_APP_Notification_2 */

  return;
}

void Custom_APP_Init(void)
{
/* USER CODE BEGIN CUSTOM_APP_Init */
//	CFG_TASK_NOTIFY_TEMP,
//		CFG_TASK_NOTIFY_BATT,
	  /* battery_service */
	Custom_App_Context.EEG_VAL=0;
	Custom_App_Context.BAT_VAL=85;
	Custom_App_Context.STEP=eeg_chnge_step;
	Custom_App_Context.Val_Notification_Status=0;
	Custom_App_Context.Bval_Notification_Status=0;
	UTIL_SEQ_RegTask(1<<CFG_TASK_NOTIFY_TEMP,UTIL_SEQ_RFU,Custom_Val_Send_Notification);
	UTIL_SEQ_RegTask(1<<CFG_TASK_NOTIFY_BATT,UTIL_SEQ_RFU,Custom_Bval_Update_Char);

	HW_TS_Create(CFG_TIM_PROC_ID_ISR,&(Custom_App_Context.TIMER),hw_ts_Repeated,callback);
/* USER CODE END CUSTOM_APP_Init */
  return;
}

/* USER CODE BEGIN FD */
static void callback(void)
{
//	HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0,GPIO_PIN_SET);
	UTIL_SEQ_SetTask(1<<CFG_TASK_NOTIFY_TEMP,CFG_SCH_PRIO_0);
//	HAL_GPIO_WritePin(GPIOB, GPIO_PIN_0,GPIO_PIN_RESET);
}
/* USER CODE END FD */

/*************************************************************
 *
 * LOCAL FUNCTIONS
 *
 *************************************************************/

  /* battery_service */
void Custom_Bval_Update_Char(void) /* Property Read */
{
//  Custom_STM_App_Update_Char(CUSTOM_STM_BVAL, (uint8_t *)UpdateCharData);
  /* USER CODE BEGIN Bval_UC*/
  UpdateCharData[0]=(uint8_t)(Custom_App_Context.BAT_VAL& 0x00FF);
  UpdateCharData[1]=(uint8_t)(Custom_App_Context.BAT_VAL>>8);
  Custom_App_Context.BAT_VAL-=1;
  Custom_STM_App_Update_Char(CUSTOM_STM_BVAL, (uint8_t *)UpdateCharData);
  /* USER CODE END Bval_UC*/
  return;
}

void Custom_Bval_Send_Notification(void) /* Property Notification */
 {
  if(Custom_App_Context.Bval_Notification_Status)
  {
//    Custom_STM_App_Update_Char(CUSTOM_STM_BVAL, (uint8_t *)NotifyCharData);
    /* USER CODE BEGIN Bval_NS*/
	NotifyCharData[0]=(uint8_t)(Custom_App_Context.BAT_VAL& 0x00FF);
	NotifyCharData[1]=(uint8_t)(Custom_App_Context.BAT_VAL>>8);
	Custom_App_Context.BAT_VAL-=1;
    Custom_STM_App_Update_Char(CUSTOM_STM_BVAL, (uint8_t *)NotifyCharData);
    /* USER CODE END Bval_NS*/
  }
  else
  {
    APP_DBG_MSG("-- CUSTOM APPLICATION : CAN'T INFORM CLIENT -  NOTIFICATION DISABLED\n ");
  }
  return;
}

  /* eeg_service */
void Custom_Val_Update_Char(void) /* Property Read */
{
//  Custom_STM_App_Update_Char(CUSTOM_STM_VAL, (uint8_t *)UpdateCharData);
  /* USER CODE BEGIN Val_UC*/
	UpdateCharData[0]=(uint8_t)(Custom_App_Context.EEG_VAL& 0x00FF);
	UpdateCharData[1]=(uint8_t)(Custom_App_Context.EEG_VAL>>8);
	Custom_App_Context.EEG_VAL+=1;
	Custom_STM_App_Update_Char(CUSTOM_STM_VAL, (uint8_t *)UpdateCharData);
  /* USER CODE END Val_UC*/
  return;
}

void Custom_Val_Send_Notification(void) /* Property Notification */
 {
  if(Custom_App_Context.Val_Notification_Status)
  {
//    Custom_STM_App_Update_Char(CUSTOM_STM_VAL, (uint8_t *)NotifyCharData);
    /* USER CODE BEGIN Val_NS*/
	  		  uint16_t i;
	  		  HAL_ADC_Start(&hadc1);
	  		  HAL_ADC_PollForConversion(&hadc1,100);
	  		  i = (uint32_t) HAL_ADC_GetValue(&hadc1);
	  		  HAL_ADC_Stop(&hadc1);
//	  		data[0]=(uint8_t)(i& 0x00FF);
//	  		data[1]=(uint8_t)(i>>8);
	  		Custom_App_Context.EEG_VAL=i;
	NotifyCharData[0]=(uint8_t)(i& 0x00FF);
	NotifyCharData[1]=(uint8_t)(i>>8);
//	Custom_App_Context.EEG_VAL+=1;
	Custom_STM_App_Update_Char(CUSTOM_STM_VAL, (uint8_t *)NotifyCharData);
    /* USER CODE END Val_NS*/
  }
  else
  {
    APP_DBG_MSG("-- CUSTOM APPLICATION : CAN'T INFORM CLIENT -  NOTIFICATION DISABLED\n ");
  }
  return;
}

/* USER CODE BEGIN FD_LOCAL_FUNCTIONS*/

/* USER CODE END FD_LOCAL_FUNCTIONS*/

/************************ (C) COPYRIGHT STMicroelectronics *****END OF FILE****/
