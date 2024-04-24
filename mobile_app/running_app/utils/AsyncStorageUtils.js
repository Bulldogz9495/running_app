import AsyncStorage from '@react-native-async-storage/async-storage';

export const setUserDataInAsyncStorage = async (userData) => {
    try {
        await AsyncStorage.multiSet([
            ['birthday', userData.data.birthday.toString()],
            ['created', userData.data.created.toString()],
            ['email', userData.data.email.toString()],
            ['first_name', userData.data.first_name.toString()],
            ['height_feet', userData.data.height_feet.toString()],
            ['height_inches', userData.data.height_inches.toString()],
            ['id', userData.data.id.toString()],
            ['last_name', userData.data.last_name.toString()],
            ['middle_name', userData.data.middle_name.toString()],
            ['motto', userData.data.motto.toString()],
            ['updated', userData.data.updated.toString()],
            ['weight_lbs', userData.data.weight_lbs.toString()],
            ['weight_ounces', userData.data.weight_ounces.toString()],
        ]);
        console.log('Successfully set user data in AsyncStorage');
        // console.log(userData);
    } catch (error) {
        console.error(error);
    }
};


export const getUserDataFromAsyncStorage = async () => {
    const userData = {data: {}};
    try {
        const result = await AsyncStorage.multiGet([
            'birthday',
            'created',
            'email',
            'first_name',
            'height_feet',
            'height_inches',
            'id',
            'last_name',
            'middle_name',
            'motto',
            'updated',
            'weight_lbs',
            'weight_ounces',
        ]);
        const [
            birthday,
            created,
            email,
            first_name,
            height_feet,
            height_inches,
            id,
            last_name,
            middle_name,
            motto,
            updated,
            weight_lbs,
            weight_ounces,
        ] = result.map(([_, value]) => value);

        userData.data.birthday = birthday;
        userData.data.created = created;
        userData.data.email = email;
        userData.data.first_name = first_name;
        userData.data.height_feet = parseFloat(height_feet);
        userData.data.height_inches = parseFloat(height_inches);
        userData.data.id = id;
        userData.data.last_name = last_name;
        userData.data.middle_name = middle_name;
        userData.data.motto = motto;
        userData.data.updated = updated;
        userData.data.weight_lbs = parseFloat(weight_lbs);
        userData.data.weight_ounces = parseFloat(weight_ounces);

        console.log('Successfully retrieved user data from AsyncStorage');
        // console.log(userData);
        return userData;

    } catch (error) {
        console.error(error);
    }
};



