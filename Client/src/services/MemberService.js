import axios from "./Axios";

export default class MemberService {
    static async getAll() {
        const response = await axios.get(
            '/members/all'
        )
        return response;
    }

    static async getOne(id) {
        const response = await axios.get(
            '/members/get/' + id
        )
        return response;
    }

    static async add(member) {
        const response = await axios.post(
            '/members/new',
            member,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        return response;
    }

    static async delete(id) {
        const response = await axios.delete(
            '/members/delete/' + id
        )
        return response;
    }
    static async update(member) {
        const response = await axios.put(
            '/members/update',
            member,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        return response;
    }
    static async addVaccine(id, vaccine) {
        const response = await axios.put(
            '/members/addVaccine/' + id,
            vaccine,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        return response;
    }

    static async getSickMembersForMonth() {
        const response = await axios.get(
            '/members/sickForMonth'
        )
        return response;
    }

    static async getUnvaccinatedMembersCount() {
        const response = await axios.get(
            '/members/unvaccinated'
        )
        return response;
    }
}