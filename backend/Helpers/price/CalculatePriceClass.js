
class Calculate {
    constructor(price, tax, rosPrice, isRos) {
        this.price = price,
            this.tax = tax,
            this.rosPrice = rosPrice,
            this.isRos = isRos
    }
}

/**
 * @author ridvancakirtr
 * @since 28.12.2020
 * @class (price, tax, rosPrice, isRos, adultCount, childCount)
 * @memberof Calculate#CalculatePriceFrontEnd
 * @param {number}   const price
 * @param {number}   const tax
 * @param {number}   const rosPrice
 * @param {boolean}  const isRos
 * @param {number}   const adultCount
 * @param {number}   const childCount
 */

class PriceFrontEnd extends Calculate {
    constructor(price, tax, rosPrice, isRos, adultCount, childCount) {
        super(price, tax, rosPrice, isRos);
        this.adultCount = adultCount,
        this.childCount = childCount
    }

    calculate() {
        let totalPassengers = Number(this.adultCount) + Number(this.childCount)

        if (Number(totalPassengers) == 1) {
            return this.onePersonCabin();
        }

        if (Number(totalPassengers) == 2) {
            return this.twoPassengerCabin();
        }

        if (Number(totalPassengers) >= 3 || Number(totalPassengers) <= 4) {
            return this.threeAndFourPassengerCabin();
        }
    }

    onePersonCabin() {
        let totalPayment = 0;
        if (this.adultCount == 1) {
            if (this.isRos) {
                totalPayment += Number(this.rosPrice) * 2;
            } else {
                totalPayment += Number(this.price);
                totalPayment += Number(this.price) * (0.5);
                totalPayment += Number(this.tax);
            }
            return totalPayment;
        }
        if (this.childCount == 1) {
            if (this.isRos) {
                totalPayment += Number(this.rosPrice) * 2;
            } else {
                totalPayment += Number(this.price);
                totalPayment += Number(this.price) * (0.5);
                totalPayment += Number(this.tax);
            }
            return totalPayment;
        }
        return totalPayment;
    }

    twoPassengerCabin() {
        let totalPayment = 0;
        if (this.adultCount + this.childCount <= 2) {
            for (let index = 0; index < this.adultCount; index++) {
                if (this.isRos) {
                    totalPayment += Number(this.rosPrice);
                } else {
                    console.log("this.price",this.price);
                        console.log("this.tax",this.tax);
                    totalPayment += Number(this.price);
                    totalPayment += Number(this.tax);

                }
            }

            for (let index = 0; index < this.childCount; index++) {
                if (this.isRos) {
                    totalPayment += this.rosPrice
                } else {
                    totalPayment += this.tax;
                }
            }
            console.log(totalPayment);
            return totalPayment;
        } else {
            console.log("Passenger capacity cannot be greater than 2");
        }

    }

    threeAndFourPassengerCabin() {
        let adltCount = 0;
        let totalPayment = 0;
        if (this.adultCount + this.childCount <= 4) {
            for (let index = 0; index < this.adultCount; index++) {
                if (this.isRos) {
                    totalPayment += Number(this.rosPrice);
                } else {
                    if (adltCount > 2) {
                        adltCount++;
                        totalPayment += (Number(this.price) - (Number(this.price) * (0.4)));
                        console.log("this.price",this.price);
                        console.log("this.tax",this.tax);
                        totalPayment += this.tax;
                    } else {
                        adltCount++;
                        totalPayment += Number(this.price);
                        totalPayment += Number(this.tax);
                    }
                }

            }

            for (let index = 0; index < this.childCount; index++) {
                if (this.isRos) {
                    totalPayment += this.rosPrice;
                } else {
                    totalPayment += this.tax;
                }

            }
            console.log(totalPayment);
            return totalPayment;
        } else {
            console.log("Passenger capacity cannot be greater than 4");
        }
    }
}

/**
 * @author ridvancakirtr
 * @since 28.12.2020
 * @class (price, tax, rosPrice, isRos, passengers)
 * @memberof Calculate#CalculatePriceBackEnd
 * @param {number}   const price
 * @param {number}   const tax
 * @param {number}   const rosPrice
 * @param {boolean}  const isRos
 * @param {object}   const passengers
 */

class PriceBackEnd extends Calculate {
    constructor(price, tax, rosPrice, isRos, passengers) {
        super(price, tax, rosPrice, isRos);
        this.passengers = passengers
    }

    calculate() {

        if (Number(this.passengers.length) == 1) {
            return this.onePersonCabin();
        }

        if (Number(this.passengers.length) == 2) {
            return this.twoPassengerCabin();
        }

        if (Number(this.passengers.length) >= 3 || Number(this.passengers) <= 4) {
            return this.threeAndFourPassengerCabin();
        }
    }

    onePersonCabin() {
        let totalPayment = 0;
        let age = this.calculateAgeCongruity(this.passengers[0]);

        if (age) {
            if (this.isRos) {
                totalPayment += Number(this.rosPrice) * 2;
            } else {
                totalPayment += Number(this.price);
                totalPayment += Number((this.price * (0.5)));
                totalPayment += Number(this.tax);
            }
        }else{
            if (this.isRos) {
                totalPayment += Number(this.rosPrice) * 2;
            } else {
                totalPayment += Number(this.price);
            }
        }
        console.log(totalPayment);
        
        return totalPayment;
    }

    twoPassengerCabin() {
        let totalPayment = 0;
        for (let index = 0; index < this.passengers.length; index++) {
            let age = this.calculateAgeCongruity(this.passengers[index]);
            if (this.isRos) {
                totalPayment += Number(this.rosPrice)
            } else {
                if (age) {
                    totalPayment += Number(this.price);
                    totalPayment += Number(this.tax);
                } else {
                    totalPayment += Number(this.tax);
                }
            }

        }
        console.log(totalPayment);
        return totalPayment;
    }

    threeAndFourPassengerCabin() {
        let adultCount = 0;
        let totalPayment = 0;
        for (let index = 0; index < this.passengers.length; index++) {
            let age = this.calculateAgeCongruity(this.passengers[index])
            if (this.isRos) {
                totalPayment += Number(this.rosPrice);
            } else {
                if (adultCount > 2) {
                    if (age) {
                        adultCount++;
                        totalPayment += (Number(this.price) - (Number(this.price) * (0.4)));
                        totalPayment += Number(this.tax);
                    } else {
                        totalPayment += Number(this.tax);
                    }
                } else {
                    if (age) {
                        adultCount++;
                        totalPayment += Number(this.price);
                        totalPayment += Number(this.tax);
                    } else {
                        totalPayment += Number(this.tax);
                    }
                }
            }

        }
        console.log(totalPayment);
        return totalPayment;
    }

    calculateAgeCongruity(person) {

        let day = new Date(person.Dob).getDay();
        let month = new Date(person.Dob).getMonth();
        let year = new Date(person.Dob).getFullYear();

        let date = new Date();
        let nowDay = date.getDate();
        let nowMonth = date.getMonth();
        let nowYear = date.getFullYear();

        let birthday = new Date(year, month, day);
        let today = new Date(nowYear, nowMonth, nowDay);

        let age = (today.getTime() - birthday.getTime()) / 1000;
        age /= (60 * 60 * 24);
        age = Math.abs(Math.round(age / 365.25));

        if (age > 16) {
            return true
        } else {
            return false
        }
    }
}

module.exports = {
    PriceFrontEnd,
    PriceBackEnd
}


