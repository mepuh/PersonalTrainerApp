// Customer type definition
export type Customer = {
    firstname: string;
    lastname: string;
    streetaddress: string;
    postcode: string;
    city: string;
    email: string;
    phone: string;
    _links: {
        self: {
            href: string;
        };
        customer: {
            href: string;
        };
        trainings: {
            href: string;
        };
    };
};

// Type without _links
export type CustomerForm = Omit<Customer, '_links'>;


// Training type definition
export type Training = {
    date: string;
    duration: number;
    activity: string;
    _links: {
        self: {
            href: string;
        };
        training: {
            href: string;
        };
        customer: {
            href: string;
        };
    };
};

// Type without _links
export type TrainingForm = Omit<Training, '_links'>;