import * as React from 'react'
import { setRenderer, SuperForm } from '../../src';
import DefaultForm from "../DefaultForm";

// setRenderer(['link'], p => {
//   return (
//     <SuperForm
//       {...p}
//       defaultValue={{
//         url: ""
//       }}
//     />
//   )
// })

const Step5Form = () => {


  return (
    <>
      <DefaultForm
        title='Full controlled example'
        hide={(state, schema,col) => {
            const r = {}
            const { attributes = {}, name } = col
            const { condition } = attributes
            if (condition) {
                const [key, value] = condition.split('=')
                if(state[key] != value){
                    r[name] = true
                }
            }
            return r
        }}
        schema={{
        "org_name": {
            "label": "Наименование организации официальное",
            "type": "string",
            "attributes": {
                "maxlength": 300,
                "required": true
            }
        },
        "org_name_eng": {
            "label": "Наименование организации на английском",
            "type": "string",
            "attributes": {
                "maxlength": 300,
                "required": false
            }
        },
        "org_logo": {
            "label": "Логотип организации",
            "type": "file",
            "conditional": "org_name=123",
            "attributes": {
                
                "required": false,
                "accept": "image/*"
            }
        },
        "org_inn": {
            "label": "ИНН компании или ИП",
            "type": "string",
            "attributes": {
                "maxlength": 30,
                "required": false
            }
        },
        "org_kpp": {
            "label": "КПП для компании",
            "type": "string",
            "attributes": {
                "maxlength": 30,
                "required": false
            }
        },
        "org_password": {
            "label": "Пароль для компании",
            "type": "string",
            "attributes": {
                "maxlength": 100,
                "required": true
            }
        },
        "org_address_legal": {
            "label": "Юридический адрес организации",
            "type": "string",
            "attributes": {
                "maxlength": 500,
                "required": true
            }
        },
        "org_rosturism_num": {
            "label": "Номер компании в реестре туроператоров РФ",
            "type": "string",
            "attributes": {
                "maxlength": 20,
                "required": false
            }
        },
        "org_commercial_name": {
            "label": "Коммерческо наименование организации",
            "type": "string",
            "attributes": {
                "maxlength": 300,
                "required": false
            }
        },
        "org_phone": {
            "type": "phone_number",
            "attributes": {
                "required": true,
                "options": "http://ec2-18-198-106-41.eu-central-1.compute.amazonaws.com:8001/api/countries?locale=ru"
            }
        },
        "org_turoper_id": {
            "type": "list",
            "attributes": {
                "required": true,
                "options": [
                    {
                        "id": 1,
                        "label": "Выездной"
                    },
                    {
                        "id": 2,
                        "label": "Локальный"
                    }
                ]
            }
        },
        "org_websites": {
            "type": "list",
            "child_type": "url",
            "attributes": {
                "required": true
            }
        },
        "org_speciality": {
            "type": "speciality_tree",
            "attributes": {
                "required": true,
                "options": [
                    {
                        "id": 1,
                        "label": "Специализации туроператоров"
                    },
                    {
                        "id": 2,
                        "label": "MICE",
                        "parent_id": 1
                    },
                    {
                        "id": 3,
                        "label": "Досуговые",
                        "parent_id": 1
                    },
                    {
                        "id": 4,
                        "label": "Отдых",
                        "parent_id": 3
                    },
                    {
                        "id": 5,
                        "label": "Бизнес-отдых",
                        "parent_id": 1
                    },
                    {
                        "id": 6,
                        "label": "Специализация отелей"
                    },
                    {
                        "id": 7,
                        "label": "Специализация 555",
                        "parent_id": 6
                    },
                    {
                        "id": 8,
                        "label": "Специализация 777",
                        "parent_id": 6
                    }
                ]
            }
        },
        "org_regions": {
            "type": "target_regions",
            "attributes": {
                "required": false,
                "options": "http://ec2-18-198-106-41.eu-central-1.compute.amazonaws.com:8001/api/countries-regions?locale=ru"
            }
        },
        "org_sales": {
            "type": "inline_form",
            "fields": {
                "divsales_email": {
                    "label": "Электронная почта отдела продаж",
                    "type": "email",
                    "attributes": {
                        "maxlength": 254,
                        "required": true
                    }
                },
                "divsales_contact": {
                    "label": "ФИО контактного лица",
                    "type": "string",
                    "attributes": {
                        "maxlength": 500,
                        "required": false
                    }
                },
                "divsales_phone": {
                    "type": "phone_number",
                    "attributes": {
                        "required": true,
                        "options": "http://ec2-18-198-106-41.eu-central-1.compute.amazonaws.com:8001/api/countries?locale=ru"
                    }
                }
            }
        },
        "captcha": {
            "type": "captcha",
            "attributes": {
                "required": true,
                "url": "http://ec2-18-198-106-41.eu-central-1.compute.amazonaws.com:8001/api/captcha"
            }
        }
        }}

      />
    </>
  )
}

export default Step5Form