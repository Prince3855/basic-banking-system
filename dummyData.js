const Customer = require('./models/customer');
const faker = require('faker');


let customerData = async function(){

    let acnumber = 268446984621684;
    await Customer.deleteMany();

    for( let i=0 ; i<15 ; i++ ) {
        let customerDetail = {
            name : faker.name.findName(),
            accountNo : acnumber,
            email : faker.internet.email(),
            mobile : faker.phone.phoneNumber(),
            balance : Math.floor(Math.random() * 10000) + 100,
            address : '29, Tirupati Soc., Kapodara, Surat-395006 '
        };
        let customer = await new Customer(customerDetail);
        await customer.save();
        acnumber++;
    }
    console.log('record added');
}

module.exports = customerData;