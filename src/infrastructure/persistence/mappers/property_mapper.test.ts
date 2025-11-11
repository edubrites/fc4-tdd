import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";
import { PropertyMapper } from "./property_mapper";

describe("PropertyMapper", () => {
    let propertyEntity: PropertyEntity;

    beforeEach(() => {
        propertyEntity = new PropertyEntity();
        propertyEntity.id = "1";
        propertyEntity.name = "Propriedade 1";
        propertyEntity.description = "Descrição 1";
        propertyEntity.maxGuests = 5;
        propertyEntity.basePricePerNight = 150;
        propertyEntity.bookings = [];
    });

    it("deve converter PropertyEntity em Property corretamente", () => {
        const property = PropertyMapper.toDomain(propertyEntity);
        expect(property).toBeInstanceOf(Property);
        expect(property.getId()).toBe("1");
        expect(property.getName()).toBe("Propriedade 1");
        expect(property.getDescription()).toBe("Descrição 1");
        expect(property.getMaxGuests()).toBe(5);
        expect(property.getBasePricePerNight()).toBe(150);
    });

    it("deve lançar erro de validação ao faltar campos obrigatórios no PropertyEntity", () => {
        propertyEntity.name = ""; // Nome vazio
        expect(() => PropertyMapper.toDomain(propertyEntity))
            .toThrow("O nome é obrigatório");

        propertyEntity.name = "Propriedade 1";
        propertyEntity.maxGuests = 0; // Núm Máximo de hóspedes inválido
        expect(() => PropertyMapper.toDomain(propertyEntity))
            .toThrow("O número máximo de hóspedes deve ser maior que zero");

    });

    it("deve converter Property para PropertyEntity corretamente", () => {
        const property = PropertyMapper.toDomain(propertyEntity);
        const convertedEntity = PropertyMapper.toPersistence(property);

        expect(convertedEntity).toBeInstanceOf(PropertyEntity);
        expect(convertedEntity.id).toBe(property.getId());
        expect(convertedEntity.name).toBe(property.getName());
        expect(convertedEntity.description).toBe(property.getDescription());
        expect(convertedEntity.maxGuests).toBe(property.getMaxGuests());
        expect(convertedEntity.basePricePerNight).toBe(property.getBasePricePerNight());
    });
});