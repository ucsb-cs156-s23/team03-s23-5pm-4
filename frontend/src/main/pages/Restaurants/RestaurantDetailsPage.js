import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RestaurantTable from 'main/components/Restaurants/RestaurantTable';
import { useParams } from "react-router-dom";
import { useCurrentUser } from 'main/utils/currentUser'


export default function RestaurantDetailsPage() {
  let { id } = useParams();

  const currentUser = useCurrentUser();

  const { data: restaurant, error, status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/restaurant?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/restaurant`,
        params: {
          id
        }
      }
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Restaurant Details</h1> 
        {
          restaurant && <RestaurantTable restaurants={[restaurant]} currentUser={currentUser} showButtons={false} />
        }
        </div>
    </BasicLayout>
  )
}
