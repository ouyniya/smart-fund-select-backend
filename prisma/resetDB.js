const prisma = require('../configs/prisma')

async function resetDatabase() {

    let tableName = Object.keys(prisma)
    .filter(key => {
        return !key.startsWith('$') && !key.startsWith('_') && !key.startsWith('constructor')
    })

    // tableName = ['user',
    //     'risk_assessment_result',
    //     'recommend_criteria',
    //     'user_risk_assessment',
    //     'risk_level_mapping',
    //     'recommend_port',
    //     'riskAssessmentQuestion',
    //     'funds',
    //     'company',
    //     'fee_detial',
    //     'fund_performance_risk',
    //     'fund_nav',
    //     'fund_risk_level',
    //     'class_abbr',
    //     'wishlist'
    // ]

    console.log(tableName)

    for (let table of tableName) {
        console.log(`Reset DB and Auto increment : ${table}`)

        await prisma[table].deleteMany()
        await prisma.$executeRawUnsafe(`Alter Table \`${table}\` auto_increment = 1`)
    }
}

resetDatabase()