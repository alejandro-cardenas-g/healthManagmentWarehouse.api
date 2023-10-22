// import { SelectQueryBuilder } from "typeorm";
// import { OrderValidator } from "../validators/order.validator";
// import { FiltersValidator } from "../validators/users-filter.validator";
// import { ClassConstructor, plainToInstance } from "class-transformer";
// import { BadRequestException } from "@nestjs/common";
// import { validate } from "class-validator";

// interface Options<K>{
//   filtersOptions: {
//     filters: FiltersValidator[],
//     schema: Record<string, keyof K>,
//     transformer?: ClassConstructor<K>
//   },
//   queryOptions: {
//     query: string[],
//     matchFields: string[]
//   },
//   fields: string[],
//   order: OrderValidator
// }

// export class SearchBuilder<T> {
//   private readonly builder: SelectQueryBuilder<T>
//   private firstWhere: boolean = false;
//   private firstSelect: boolean = false;
//   private filters: FiltersValidator[] = [];
//   private query: string[] = [];
//   private fields: string[] = [];
//   private order: OrderValidator;

//   constructor(selectQueryBuilder: SelectQueryBuilder<T>){
//     this.builder = selectQueryBuilder;
//   }

//   set Fields(fields: string[]){
//     this.fields = fields;
//   }


//   addFields(fields: string[]){
//     if(!fields) return;
//     if(!this.firstSelect){
//       this.builder.select(fields);
//       this.firstSelect = true;
//       return;
//     }
//     this.builder.addSelect(fields)
//   }

//   addOrder(order: OrderValidator){
//     const {by, type} = order;
//     this.builder.orderBy({[by]: type});
//   }

//   addMatchQuery(query: string[], matchFields: string[]){
//     if(!query.length) return;
//     for(const matchField of matchFields){
//       for(const value of query){
//         const matchValue = `%${value}%`;
//         const matchQuery = `${matchField} ilike :matchValue`
//         if(!this.firstWhere) {
//           this.builder.where(matchQuery, {matchValue })
//           this.firstWhere = true;
//           continue;
//         }
//         this.builder.orWhere(matchQuery, {matchValue})
//         continue;
//       }
//     }
//   }

//   search(){
//     return this.builder.getMany()
//   }

//   async addFilters<K>(
//     filters: FiltersValidator[],
//     schema: Record<string, keyof K>,
//     transformer?: ClassConstructor<K>
//   ){
//     if(!filters.length) return;
//     const plainObject: Partial<Record<keyof K, string>> = {};
//     for(const {key, value} of filters){
//       plainObject[schema[key]] = value;
//     }
//     let transformFilters: Partial<K> | Partial<Record<keyof K, string>> = plainObject;
//     if(transformer) {
//       transformFilters = plainToInstance(transformer, plainObject);
//       const errors = await validate(transformFilters)
//       if(errors.length) throw new BadRequestException(errors.map((e) => ({
//         ...e.constraints,
//       })))
//     }
//     for(const [key, value] of Object.entries(transformFilters)){
//       const filterQuery = `${key} = :${key}`;
//       if(!this.firstWhere) {
//         this.builder.where(filterQuery, { [key]: value })
//         this.firstWhere = true;
//         continue;
//       }
//       this.builder.andWhere(filterQuery, { [key]: value })
//         continue;
//       }
    
//   }
// } 

// export const schema = () => {
//   const a = [
//     {key: "active", value: "true"},
//     {key: "isRoot", value: "false"},
//   ]
//   const schema = {
//     active: "e.active",
//     isRoot: "e.isRoot"
//   }
//   const b: Record<string, string> = {};
//   for(const {key, value} of a){
//     const newKey = schema
//     b[schema[key]] = value;
//   }
  
// }
