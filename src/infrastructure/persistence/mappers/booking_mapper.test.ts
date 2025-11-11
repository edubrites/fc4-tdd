import { BookingMapper } from "./booking_mapper";
import { BookingEntity } from "../entities/booking_entity";
import { UserEntity } from '../entities/user_entity';
import { PropertyEntity } from '../entities/property_entity';
import { Booking } from "../../../domain/entities/booking";
import { PropertyMapper } from "./property_mapper";
import { DateRange } from "../../../domain/value_objects/date_range";
import { UserMapper } from "./user_mapper";

describe("BookingMapper", () => {
    let bookingEntity: BookingEntity;
    let userEntity: UserEntity;
    let propertyEntity: PropertyEntity;

    beforeEach(() => {
        bookingEntity = new BookingEntity();
        userEntity = new UserEntity();
        propertyEntity = new PropertyEntity();

        userEntity.id = "1";
        userEntity.name = "Eduardo Brites";

        propertyEntity.id = "1";
        propertyEntity.name = "Propriedade 1";
        propertyEntity.description = "Descrição 1";
        propertyEntity.maxGuests = 5;
        propertyEntity.basePricePerNight = 100;

        bookingEntity.id = "1";
        bookingEntity.property = propertyEntity;
        bookingEntity.guest = userEntity;
        bookingEntity.startDate = new Date("2025-12-10");
        bookingEntity.endDate = new Date("2025-12-14");
        bookingEntity.guestCount = 2;
        bookingEntity.totalPrice = 100;
        bookingEntity.status = "CONFIRMED";
    });

    it("deve converter BookingEntity em Booking corretamente", () => {
        const booking = BookingMapper.toDomain(bookingEntity);
        expect(booking).toBeInstanceOf(Booking);
        expect(booking.getId()).toBe(bookingEntity.id);
        expect(booking.getGuestCount()).toBe(bookingEntity.guestCount);
        expect(booking.getTotalPrice()).toBe(bookingEntity.totalPrice);
        expect(booking.getStatus()).toBe(bookingEntity.status);
    });

    it("deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", () => {
        bookingEntity.guestCount = 0;
        expect(() => BookingMapper.toDomain(bookingEntity)).toThrow('O número de hóspedes deve ser maior que zero.');

        const rangeOcupado = new DateRange(
            new Date("2025-12-10"),
            new Date("2025-12-14")
        );

        const property = PropertyMapper.toDomain(propertyEntity);
        const guest = UserMapper.toDomain(userEntity);

        new Booking("b1", property, guest, rangeOcupado, 2);
        bookingEntity.guestCount = 4;
        expect(() => {
            BookingMapper.toDomain(bookingEntity, property);
        }).toThrow("A propriedade não está disponível para o período selecionado.");
    });

    it("deve converter Booking para BookingEntity corretamente", () => {
        const booking = BookingMapper.toDomain(bookingEntity);
        const convertedEntity = BookingMapper.toPersistence(booking);

        expect(convertedEntity).toBeInstanceOf(BookingEntity);
    });
});