const Profile = require("../Models/ProfileModel");
const opportunitys = require("../Models/opportunityModel");
const request = require("../Models/mentorRequestModel");

exports.getProfileCalendar = async (req, res) => {
  try {
    const profile = await Profile.find({ user: req.user.id });
    //   console.log(profile);
    //   const today = new Date();
    //   const year = today.getFullYear();
    //   const month = today.getMonth() + 1;
    //   const daysInMonth = new Date(year, month, 0).getDate();
    //   const monthName = today.toLocaleString("default", { month: "long" });

    const startdate = profile.busyDays
      ? new Date(profile.busyDays?.from).getDate()
      : 18;
    const enddate = profile.busyDays
      ? new Date(profile.busyDays?.to)?.getDate()
      : 22;
    let unavailable = [];
    for (let i = startdate; i <= enddate; i++) {
      unavailable.push(i);
    }
    const calendarData = {
      profile,
      busyDays: unavailable,
    };

    res.status(200).send(calendarData);
  } catch (e) {
    res.status(400).send(e);
  }
};
