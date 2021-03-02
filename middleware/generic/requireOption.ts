/**
 * returns the object from object repository or throws a TypeError
 * @param objRepo object repository
 * @param propertyName name of the object
 */
import objectRepository from '../../models/ObjectRepository';

export default function requireOption(objRepo: objectRepository, propertyName: string) {
    if (objRepo && objRepo[propertyName]) {
        return objRepo[propertyName];
    }

    throw new TypeError(`${propertyName} required`);
}
