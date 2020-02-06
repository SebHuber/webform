var appId = 'BE30094518';
var deviceId = IMI.ICDeviceProfile.getDefaultDeviceId();
var userId;
var clientKey = 'mHZ73Xnf';
var imiconfig = new IMI.ICConfig(appId, clientKey);
IMI.IMIconnect.startup(imiconfig);

var callback = {
    onSuccess: function(res) {
        console.log(" success", res);
    },
    onFailure: function(err) {
        console.log(" failed", err);
    }

};

function register() {
    console.log('IMI - registering');
    var deviceId = IMI.ICDeviceProfile.getDefaultDeviceId();

    if (!IMI.IMIconnect.isRegistered()) {
        userId = generateUserId();

        var deviceProfile = new IMI.ICDeviceProfile(deviceId, userId);
        IMI.IMIconnect.register(deviceProfile, callback);
    }
    if (!userId) {
        var deviceProfile = IMI.IMIconnect.getDeviceProfile();
        if (deviceProfile && deviceProfile.getUserId())
            userId = deviceProfile.getUserId();
    }
    setTimeout(function() {
        var spnUserId = document.getElementById('spnUserId');
        spnUserId.textContent = userId;
    }, 300);
}

function generateUserId() {
    var a = Math.random() * 10000;
    return a.toString().substring(0, 4);
}


function unregister() {
    IMI.IMIconnect.unregister();
    localStorage.clear();
    var spnUserId = document.getElementById('spnUserId');
    spnUserId.textContent = 'No user registered';
}

register();